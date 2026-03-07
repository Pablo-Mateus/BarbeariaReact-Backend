import Schedule, { IScheduleDocument } from './schedule.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
import { FilterQuery, Types } from 'mongoose';

export class ScheduleRepository extends BaseRepository<IScheduleDocument> {
  constructor() {
    super(Schedule);
  }

  async findByDiaSemana(tenantId: string, diasemana: string): Promise<IScheduleDocument | null> {
    return this.findOne(tenantId, { diasemana } as FilterQuery<IScheduleDocument>);
  }

  async removeSlots(tenantId: string, diasemana: string, slots: number[]): Promise<void> {
    await Schedule.updateOne(
      { tenantId, diasemana } as FilterQuery<IScheduleDocument>,
      { $pull: { disponiveis: { $in: slots } } }
    ).exec();
  }

  async restoreSlots(tenantId: string, diasemana: string, slots: number[]): Promise<void> {
    await Schedule.updateOne(
      { tenantId, diasemana } as FilterQuery<IScheduleDocument>,
      { $push: { disponiveis: { $each: slots, $sort: 1 } } }
    ).exec();
  }

  async upsertSchedule(
    tenantId: string,
    diasemana: string,
    data: {
      inicio: number;
      fim: number;
      intervalo: number;
      arraydehorarios: number[];
      disponiveis: number[];
    }
  ): Promise<IScheduleDocument> {
    const existing = await this.findByDiaSemana(tenantId, diasemana);
    if (existing) {
      const updated = await Schedule.findOneAndUpdate(
        { tenantId, diasemana } as FilterQuery<IScheduleDocument>,
        { $set: data },
        { new: true }
      ).exec();
      return updated!;
    }

    return this.create({
      tenantId: new Types.ObjectId(tenantId),
      diasemana,
      ...data,
    } as Partial<IScheduleDocument>);
  }
}
