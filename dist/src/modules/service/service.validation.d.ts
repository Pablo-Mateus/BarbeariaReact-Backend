import { z } from 'zod';
export declare const createServiceSchema: z.ZodObject<{
    titulo: z.ZodString;
    descricao: z.ZodString;
    duracao: z.ZodNumber;
    preco: z.ZodNumber;
}, z.core.$strip>;
export declare const updateServiceSchema: z.ZodObject<{
    titulo: z.ZodOptional<z.ZodString>;
    descricao: z.ZodOptional<z.ZodString>;
    duracao: z.ZodOptional<z.ZodNumber>;
    preco: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
//# sourceMappingURL=service.validation.d.ts.map