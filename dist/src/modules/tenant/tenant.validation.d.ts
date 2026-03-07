import { z } from 'zod';
export declare const createTenantSchema: z.ZodObject<{
    nome: z.ZodString;
    slug: z.ZodString;
    email: z.ZodString;
    telefone: z.ZodString;
    endereco: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateTenantSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    telefone: z.ZodOptional<z.ZodString>;
    endereco: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const tenantSlugParamSchema: z.ZodObject<{
    slug: z.ZodString;
}, z.core.$strip>;
export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
//# sourceMappingURL=tenant.validation.d.ts.map