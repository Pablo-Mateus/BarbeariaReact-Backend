import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodString;
    telefone: z.ZodString;
    senha: z.ZodString;
    confirmarsenha: z.ZodString;
    tenantSlug: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    senha: z.ZodString;
    tenantSlug: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    email: z.ZodString;
    tenantSlug: z.ZodString;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    senha: z.ZodString;
    confirmarsenha: z.ZodString;
    token: z.ZodString;
}, z.core.$strip>;
export declare const confirmEmailSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
//# sourceMappingURL=auth.validation.d.ts.map