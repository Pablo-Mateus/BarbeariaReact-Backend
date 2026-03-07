import mongoose, { Schema } from 'mongoose';
const dailyAvailabilitySchema = new Schema({
    date: { type: Date, required: true, unique: true },
    diasemana: { type: String, required: true },
    availableSlots: { type: [Number], default: [] },
    occupiedSlots: { type: [Number], default: [] },
}, { timestamps: true });
const DailyAvailability = mongoose.model('DailyAvailability', dailyAvailabilitySchema);
export default DailyAvailability;
//# sourceMappingURL=DailyAvailabilitySchema.js.map