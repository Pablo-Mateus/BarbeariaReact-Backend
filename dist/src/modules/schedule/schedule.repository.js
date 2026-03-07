import Schedule from './schedule.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
import { Types } from 'mongoose';
export class ScheduleRepository extends BaseRepository {
    constructor() {
        super(Schedule);
    }
    async findByDiaSemana(tenantId, diasemana) {
        return this.findOne(tenantId, { diasemana });
    }
    async removeSlots(tenantId, diasemana, slots) {
        await Schedule.updateOne({ tenantId, diasemana }, { $pull: { disponiveis: { $in: slots } } }).exec();
    }
    async restoreSlots(tenantId, diasemana, slots) {
        await Schedule.updateOne({ tenantId, diasemana }, { $push: { disponiveis: { $each: slots, $sort: 1 } } }).exec();
    }
    async upsertSchedule(tenantId, diasemana, data) {
        const existing = await this.findByDiaSemana(tenantId, diasemana);
        if (existing) {
            const updated = await Schedule.findOneAndUpdate({ tenantId, diasemana }, { $set: data }, { new: true }).exec();
            return updated;
        }
        return this.create({
            tenantId: new Types.ObjectId(tenantId),
            diasemana,
            ...data,
        });
    }
}
//# sourceMappingURL=schedule.repository.js.map