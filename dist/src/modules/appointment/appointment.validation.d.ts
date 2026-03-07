import { z } from 'zod';
export declare const createAppointmentSchema: z.ZodObject<{
    tempo: z.ZodNumber;
    servico: z.ZodString;
    hora: z.ZodNumber;
    diaSemana: z.ZodString;
    date: z.ZodString;
}, z.core.$strip>;
export declare const cancelAppointmentSchema: z.ZodObject<{
    agendamentoId: z.ZodString;
}, z.core.$strip>;
export declare const confirmAppointmentSchema: z.ZodObject<{
    agendamentoId: z.ZodString;
}, z.core.$strip>;
export declare const dayAvailabilitySchema: z.ZodObject<{
    dia: z.ZodString;
    date: z.ZodString;
}, z.core.$strip>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type DayAvailabilityInput = z.infer<typeof dayAvailabilitySchema>;
//# sourceMappingURL=appointment.validation.d.ts.map