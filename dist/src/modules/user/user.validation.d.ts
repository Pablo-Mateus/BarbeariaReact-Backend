import { z } from 'zod';
export declare const updateUserSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    telefone: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        owner: "owner";
        barber: "barber";
        client: "client";
    }>>;
}, z.core.$strip>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
//# sourceMappingURL=user.validation.d.ts.map