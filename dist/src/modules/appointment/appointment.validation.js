import { z } from 'zod';
export const createAppointmentSchema = z.object({
    tempo: z.number().positive('Horário é obrigatório'),
    servico: z.string().min(1, 'Serviço é obrigatório'),
    hora: z.number().nonnegative('Duração é obrigatória'),
    diaSemana: z.string().min(1, 'Dia da semana é obrigatório'),
    date: z.string().min(1, 'Data é obrigatória'),
});
export const cancelAppointmentSchema = z.object({
    agendamentoId: z.string().min(1, 'ID do agendamento é obrigatório'),
});
export const confirmAppointmentSchema = z.object({
    agendamentoId: z.string().min(1, 'ID do agendamento é obrigatório'),
});
export const dayAvailabilitySchema = z.object({
    dia: z.string().min(1, 'Dia da semana é obrigatório'),
    date: z.string().min(1, 'Data é obrigatória'),
});
//# sourceMappingURL=appointment.validation.js.map