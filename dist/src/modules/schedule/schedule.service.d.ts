import { ScheduleRepository } from './schedule.repository.js';
import { DefineScheduleInput, GetTimesInput } from './schedule.validation.js';
export declare class ScheduleService {
    private readonly scheduleRepository;
    constructor(scheduleRepository: ScheduleRepository);
    /**
     * Define working hours for a day of the week.
     * Preserves EXACT original logic from index.ts /DefinirHorario:
     * - Parses HH:MM format to minutes
     * - Validates start < end
     * - Generates slot array from start to end with interval
     * - Upserts (creates or updates) the schedule
     */
    defineSchedule(tenantId: string, data: DefineScheduleInput): Promise<{
        message: string;
    }>;
    /**
     * Get working hours for a day of the week.
     * Preserves original /getTimes logic.
     */
    getTimes(tenantId: string, data: GetTimesInput): Promise<{
        inicio: string;
        fim: string;
        intervalo: number;
    }>;
}
//# sourceMappingURL=schedule.service.d.ts.map