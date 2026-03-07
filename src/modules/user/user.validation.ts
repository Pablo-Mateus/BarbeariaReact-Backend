import { z } from 'zod';

export const updateUserSchema = z.object({
  nome: z.string().min(1).trim().optional(),
  telefone: z.string().min(1).trim().optional(),
  role: z.enum(['owner', 'barber', 'client']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
