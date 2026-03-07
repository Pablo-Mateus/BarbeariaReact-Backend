import { z } from 'zod';
export const createTenantSchema = z.object({
    nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').trim(),
    slug: z
        .string()
        .min(2, 'Slug deve ter ao menos 2 caracteres')
        .max(50)
        .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
        .trim(),
    email: z.string().email('Email inválido').trim().toLowerCase(),
    telefone: z.string().min(8, 'Telefone inválido').trim(),
    endereco: z.string().optional(),
});
export const updateTenantSchema = createTenantSchema.partial();
export const tenantSlugParamSchema = z.object({
    slug: z.string().min(1),
});
//# sourceMappingURL=tenant.validation.js.map