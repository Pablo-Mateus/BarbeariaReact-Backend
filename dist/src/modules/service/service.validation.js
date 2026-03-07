import { z } from 'zod';
export const createServiceSchema = z.object({
    titulo: z.string().min(1, 'Título é obrigatório').trim(),
    descricao: z.string().min(1, 'Descrição é obrigatória').trim(),
    duracao: z.number().positive('Duração deve ser positiva'),
    preco: z.number().nonnegative('Preço deve ser não-negativo'),
});
export const updateServiceSchema = createServiceSchema.partial().extend({
    isActive: z.boolean().optional(),
});
//# sourceMappingURL=service.validation.js.map