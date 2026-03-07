import crypto from 'crypto';
import { TenantRepository } from './tenant.repository.js';
import { ITenantDocument } from './tenant.model.js';
import { UserRepository } from '../user/user.repository.js';
import { CreateTenantInput, UpdateTenantInput } from './tenant.validation.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../shared/errors/app-error.js';
import { hashPassword } from '../../shared/utils/password.js';
import { sendEmail } from '../../shared/utils/email.js';
import { env } from '../../config/env.js';
import { UserRole } from '../../shared/types/index.js';
import { IUserDocument } from '../user/user.model.js';

export class TenantService {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createTenant(data: CreateTenantInput): Promise<ITenantDocument> {
    const slugExists = await this.tenantRepository.existsBySlug(data.slug);
    if (slugExists) {
      throw new ConflictError('Já existe uma barbearia com este slug');
    }

    // Hash password for the owner
    const passwordHash = await hashPassword(data.senha);

    // Create Tenant (isActive: false by default now)
    const tenant = await this.tenantRepository.create({
      nome: data.nome,
      slug: data.slug,
      email: data.email,
      telefone: data.telefone,
      endereco: data.endereco,
      isActive: false,
      configuracoes: {
        timezone: 'America/Sao_Paulo',
      },
    });

    try {
      // Create Owner User
      const user = await this.userRepository.create({
        tenantId: tenant._id,
        nome: data.nome, // Using shop name as owner name initially or we could add a field for it
        email: data.email,
        telefone: data.telefone,
        senha: passwordHash,
        role: 'owner' as UserRole,
        active: false,
      } as Partial<IUserDocument>);

      // Generate confirmation token
      const confirmToken = crypto.randomBytes(32).toString('hex');
      const confirmTokenExpire = new Date(Date.now() + 3600000); // 1 hour
      user.confirmToken = confirmToken;
      user.confirmTokenExpire = confirmTokenExpire;
      await user.save();

      // Send confirmation email
      const confirmLink = `${env.FRONTEND_URL}/${data.slug}/confirm-email?token=${confirmToken}`;
      await sendEmail({
        to: user.email,
        subject: 'Confirmação de cadastro da sua barbearia',
        html: `<p>Olá! Para confirmar o cadastro da sua barbearia e sua conta de administrador, clique no link abaixo: </p>
        <a href="${confirmLink}">${confirmLink}</a>
        <p>Este link expira em 1 hora.</p>`,
      });

      return tenant;
    } catch (error) {
      // Rollback: delete tenant if user creation or email fails
      console.log('Erro ao criar dono ou enviar email:', error);
      await (tenant as any).deleteOne();
      throw new BadRequestError(
        'Não foi possível finalizar o cadastro. Tente novamente mais tarde.'
      );
    }
  }

  async getTenantBySlug(slug: string): Promise<ITenantDocument> {
    const tenant = await this.tenantRepository.findBySlug(slug);
    if (!tenant) {
      throw new NotFoundError('Barbearia');
    }
    return tenant;
  }

  async getTenantById(id: string): Promise<ITenantDocument> {
    const tenant = await this.tenantRepository.findById(id);
    if (!tenant) {
      throw new NotFoundError('Barbearia');
    }
    return tenant;
  }

  async listTenants(): Promise<ITenantDocument[]> {
    return this.tenantRepository.findAll();
  }

  async updateTenant(id: string, data: UpdateTenantInput): Promise<ITenantDocument> {
    if (data.slug) {
      const existing = await this.tenantRepository.findBySlug(data.slug);
      if (existing && (existing._id as import('mongoose').Types.ObjectId).toString() !== id) {
        throw new ConflictError('Já existe uma barbearia com este slug');
      }
    }

    const tenant = await this.tenantRepository.updateById(id, data);
    if (!tenant) {
      throw new NotFoundError('Barbearia');
    }
    return tenant;
  }
}
