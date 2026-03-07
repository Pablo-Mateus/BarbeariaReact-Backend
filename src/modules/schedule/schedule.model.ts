import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface ISchedule {
  tenantId: Types.ObjectId;
  diasemana: string;
  inicio: number;
  fim: number;
  intervalo: number;
  arraydehorarios: number[];
  disponiveis: number[];
}

export interface IScheduleDocument extends ISchedule, Document {}

const scheduleSchema = new Schema<IScheduleDocument>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    diasemana: { type: String, required: true },
    inicio: { type: Number, required: true },
    fim: { type: Number, required: true },
    intervalo: { type: Number, required: true },
    arraydehorarios: { type: [Number], default: [] },
    disponiveis: { type: [Number], default: [] },
  },
  { timestamps: true }
);

// Unique schedule per tenant per day of week
scheduleSchema.index({ tenantId: 1, diasemana: 1 }, { unique: true });

const Schedule: Model<IScheduleDocument> = mongoose.model<IScheduleDocument>(
  'Schedule',
  scheduleSchema
);

export default Schedule;
