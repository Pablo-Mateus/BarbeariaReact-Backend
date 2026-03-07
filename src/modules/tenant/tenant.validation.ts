import { z } from 'zod';

export const createTenantSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter ao menos 2 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]{3,50}$/, 'Nome deve conter apenas letras e ter entre 3 e 50 caracteres')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug deve ter ao menos 2 caracteres')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
    .trim(),
  email: z.string().email('Email inválido').trim().toLowerCase(),
  telefone: z
    .string()
    .min(8, 'Telefone inválido')
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Telefone deve estar no formato (11) 99999-9999')
    .trim(),
  endereco: z.string().optional(),
  senha: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
});

export const updateTenantSchema = createTenantSchema.partial();

export const tenantSlugParamSchema = z.object({
  slug: z.string().min(1),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
