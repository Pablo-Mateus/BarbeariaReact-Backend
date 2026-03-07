import { z } from 'zod';
export declare const defineScheduleSchema: z.ZodObject<{
    inicio: z.ZodString;
    fim: z.ZodString;
    intervalo: z.ZodString;
    diaSemana: z.ZodString;
}, z.core.$strip>;
export declare const getTimesSchema: z.ZodObject<{
    dia: z.ZodString;
}, z.core.$strip>;
export type DefineScheduleInput = z.infer<typeof defineScheduleSchema>;
export type GetTimesInput = z.infer<typeof getTimesSchema>;
//# sourceMappingURL=schedule.validation.d.ts.map