import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(10, 'A senha deve conter no mínimo 10 caracteres')
  .regex(/[!@#$%&*]/, 'A senha deve conter um caractere especial');

export const registerSchema = z
  .object({
    nome: z
      .string()
      .min(1, 'O nome é obrigatório')
      .regex(/^[a-zA-ZÀ-ÿ\s]{3,50}$/, 'Nome deve conter apenas letras e ter entre 3 e 50 caracteres')
      .trim(),
    email: z.string().email('Email inválido').trim().toLowerCase(),
    telefone: z
      .string()
      .min(1, 'O telefone é obrigatório')
      .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Telefone deve estar no formato (11) 99999-9999')
      .trim(),
    senha: passwordSchema,
    confirmarsenha: z.string().min(1, 'Confirmação de senha é obrigatória'),
    tenantSlug: z.string().min(1, 'Slug da barbearia é obrigatório'),
  })
  .refine((data) => data.senha === data.confirmarsenha, {
    message: 'As senhas não conferem',
    path: ['confirmarsenha'],
  });

export const loginSchema = z.object({
  email: z.string().email('Email inválido').trim().toLowerCase(),
  senha: z.string().min(1, 'Insira sua senha'),
  tenantSlug: z.string().min(1, 'Slug da barbearia é obrigatório'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido').trim().toLowerCase(),
  tenantSlug: z.string().min(1, 'Slug da barbearia é obrigatório'),
});

export const changePasswordSchema = z
  .object({
    senha: passwordSchema,
    confirmarsenha: z.string().min(1, 'Confirmação é obrigatória'),
    token: z.string().min(1, 'Token é obrigatório'),
  })
  .refine((data) => data.senha === data.confirmarsenha, {
    message: 'As senhas não condicem',
    path: ['confirmarsenha'],
  });

export const confirmEmailSchema = z.object({
  token: z.string().min(1, 'Token de confirmação é obrigatório'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
