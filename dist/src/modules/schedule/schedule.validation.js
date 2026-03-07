import { z } from 'zod';
export const defineScheduleSchema = z.object({
    inicio: z.string().min(1, 'Horário de início é obrigatório'),
    fim: z.string().min(1, 'Horário de fim é obrigatório'),
    intervalo: z.string().min(1, 'Intervalo é obrigatório'),
    diaSemana: z.string().min(1, 'Dia da semana é obrigatório'),
});
export const getTimesSchema = z.object({
    dia: z.string().min(1, 'Dia da semana é obrigatório'),
});
//# sourceMappingURL=schedule.validation.js.map