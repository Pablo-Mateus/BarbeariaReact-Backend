import { Model, Document, Types } from 'mongoose';
export interface ISchedule {
    tenantId: Types.ObjectId;
    diasemana: string;
    inicio: number;
    fim: number;
    intervalo: number;
    arraydehorarios: number[];
    disponiveis: number[];
}
export interface IScheduleDocument extends ISchedule, Document {
}
declare const Schedule: Model<IScheduleDocument>;
export default Schedule;
//# sourceMappingURL=schedule.model.d.ts.map