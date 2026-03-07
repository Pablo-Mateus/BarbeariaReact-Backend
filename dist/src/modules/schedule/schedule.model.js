import mongoose, { Schema } from 'mongoose';
const scheduleSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    diasemana: { type: String, required: true },
    inicio: { type: Number, required: true },
    fim: { type: Number, required: true },
    intervalo: { type: Number, required: true },
    arraydehorarios: { type: [Number], default: [] },
    disponiveis: { type: [Number], default: [] },
}, { timestamps: true });
// Unique schedule per tenant per day of week
scheduleSchema.index({ tenantId: 1, diasemana: 1 }, { unique: true });
const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;
//# sourceMappingURL=schedule.model.js.map