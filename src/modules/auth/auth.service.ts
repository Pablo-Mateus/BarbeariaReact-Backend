import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRepository } from '../user/user.repository.js';
import { TenantRepository } from '../tenant/tenant.repository.js';
import { IUserDocument } from '../user/user.model.js';
import { RegisterInput, LoginInput, ResetPasswordInput, ChangePasswordInput } from './auth.validation.js';
import { IJwtPayload, UserRole } from '../../shared/types/index.js';
import { hashPassword, comparePassword } from '../../shared/utils/password.js';
import { sendEmail } from '../../shared/utils/email.js';
import { env } from '../../config/env.js';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from '../../shared/errors/app-error.js';

interface AuthResult {
  token: string;
  redirect: string;
  decoded: IJwtPayload;
  message: string;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository
  ) {}

  async register(data: RegisterInput): Promise<{ message: string }> {
    // Resolve tenant by slug
    const tenant = await this.tenantRepository.findBySlug(data.tenantSlug);
    if (!tenant) {
      throw new NotFoundError('Barbearia');
    }

    const tenantId = (tenant._id as import('mongoose').Types.ObjectId).toString();

    // Check if email already exists for this tenant
    const userExists = await this.userRepository.findByEmail(tenantId, data.email);
    if (userExists) {
      throw new ConflictError('Por favor utilize outro email.');
    }

    // Hash password
    const passwordHash = await hashPassword(data.senha);

    // Create user
    const user = await this.userRepository.create({
      tenantId: tenant._id,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      senha: passwordHash,
      role: data.email === tenant.email ? ('owner' as UserRole) : ('client' as UserRole),
      active: false,
    } as Partial<IUserDocument>);

    // Generate confirmation token
    const confirmToken = crypto.randomBytes(32).toString('hex');
    const confirmTokenExpire = new Date(Date.now() + 3600000); // 1 hour
    user.confirmToken = confirmToken;
    user.confirmTokenExpire = confirmTokenExpire;
    await user.save();

    // Send confirmation email
    const confirmLink = `${env.FRONTEND_URL}/${data.tenantSlug}/confirm-email?token=${confirmToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Confirmação de cadastro',
        html: `<p>Para confirmar seu cadastro, clique no link abaixo: </p>
        <a href="${confirmLink}">${confirmLink}</a>
        <p>Este link expira em 1 hora.</p>`,
      });
    } catch (emailError) {
      // Rollback: delete user if email fails
      console.log('Erro ao enviar email de confirmação:', emailError);
      await this.userRepository.deleteById(tenantId, (user._id as import('mongoose').Types.ObjectId).toString());
      throw new BadRequestError(
        'Não foi possível enviar o email de confirmação. Tente se registrar novamente.'
      );
    }

    return { message: 'Por favor, confirme seu email para fazer login.' };
  }

  async confirmEmail(token: string): Promise<{ message: string }> {
    // 1. Check if token exists at all
    const userByToken = await this.userRepository.findByConfirmTokenAny(token);
    if (!userByToken) {
      throw new BadRequestError('Token de confirmação inválido');
    }

    // 2. Check if it's expired
    const user = await this.userRepository.findByConfirmToken(token);
    if (!user) {
      throw new BadRequestError('O link de confirmação expirou. Por favor, tente se registrar novamente.');
    }

    user.active = true;
    user.confirmToken = undefined;
    user.confirmTokenExpire = undefined;
    await user.save();

    // 3. If the user is an owner, activate the tenant
    if (user.role === 'owner') {
      const tenant = await this.tenantRepository.findById(user.tenantId.toString());
      if (tenant) {
        tenant.isActive = true;
        await tenant.save();
      }
    }

    return { message: 'Email confirmado com sucesso! Você já pode fazer login.' };
  }

  async login(data: LoginInput): Promise<AuthResult> {
    // Resolve tenant
    const tenant = await this.tenantRepository.findBySlug(data.tenantSlug);
    if (!tenant) {
      throw new NotFoundError('Barbearia');
    }

    const tenantId = (tenant._id as import('mongoose').Types.ObjectId).toString();

    // Find user
    const user = await this.userRepository.findByEmail(tenantId, data.email);
    if (!user) {
      throw new BadRequestError('Esse email não existe');
    }

    // Check active
    if (!user.active) {
      throw new ForbiddenError('Confirme seu email antes de fazer login.');
    }

    // Compare password
    const senhaCompare = await comparePassword(data.senha, user.senha);
    if (!senhaCompare) {
      throw new BadRequestError('Senha inválida');
    }

    // Create JWT with tenant context
    const payload: IJwtPayload = {
      userId: (user._id as import('mongoose').Types.ObjectId).toString(),
      tenantId: tenantId,
      role: user.role,
      name: user.nome,
    };

    const token = jwt.sign(payload, env.SECRET, { expiresIn: '1h' });

    const decoded = jwt.verify(token, env.SECRET) as IJwtPayload;

    // Determine redirect based on role
    const isOwnerOrBarber = user.role === 'owner' || user.role === 'barber';
    const redirect = isOwnerOrBarber ? '/logadoBarbeiro' : '/logado';

    return {
      message: 'Autenticado com sucesso',
      token,
      redirect,
      decoded,
    };
  }

  async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    const tenant = await this.tenantRepository.findBySlug(data.tenantSlug);
    if (!tenant) {
      throw new NotFoundError('Barbearia');
    }

    const user = await this.userRepository.findByEmail((tenant._id as import('mongoose').Types.ObjectId).toString(), data.email);
    if (!user) {
      throw new BadRequestError('Email não cadastrado!');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpire = new Date(Date.now() + 3600000);
    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();

    const resetLink = `${env.FRONTEND_URL}/${data.tenantSlug}/forgotPass?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Redefinição de senha',
      html: `<p>Para redefinir sua senha, clique no link abaixo: </p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este link expira em 1 hora.</p>`,
    });

    return { message: 'Email enviado com sucesso' };
  }

  async changePassword(data: ChangePasswordInput): Promise<{ message: string }> {
    const user = await this.userRepository.findByResetToken(data.token);
    if (!user) {
      throw new BadRequestError('Token inválido ou expirado, gere um novo link');
    }

    // Check if new password is same as old
    const isSamePassword = await comparePassword(data.senha, user.senha);
    if (isSamePassword) {
      throw new BadRequestError('A senha que você digitou é igual a anterior!');
    }

    user.senha = await hashPassword(data.senha);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    return { message: 'Senha redefinida com sucesso!' };
  }

  async checkAuth(userId: string, _tenantId: string, role: string, name: string): Promise<{
    isAuthenticated: boolean;
    user: string;
    name: { name: string; role: string };
    isAdmin: boolean;
  }> {
    const isAdmin = role === 'owner' || role === 'barber';
    return {
      isAuthenticated: true,
      user: userId,
      name: { name, role },
      isAdmin,
    };
  }
}
