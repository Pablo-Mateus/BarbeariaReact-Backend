import { IScheduleDocument } from './schedule.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
export declare class ScheduleRepository extends BaseRepository<IScheduleDocument> {
    constructor();
    findByDiaSemana(tenantId: string, diasemana: string): Promise<IScheduleDocument | null>;
    removeSlots(tenantId: string, diasemana: string, slots: number[]): Promise<void>;
    restoreSlots(tenantId: string, diasemana: string, slots: number[]): Promise<void>;
    upsertSchedule(tenantId: string, diasemana: string, data: {
        inicio: number;
        fim: number;
        intervalo: number;
        arraydehorarios: number[];
        disponiveis: number[];
    }): Promise<IScheduleDocument>;
}
//# sourceMappingURL=schedule.repository.d.ts.map