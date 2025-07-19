const mongoose = require('mongoose');

const DailyAvailabilitySchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true }, // Data específica (ex: 2025-07-22T00:00:00.000Z)
    diasemana: { type: String, required: true }, // "Segunda", "Terca" (para referência)
    availableSlots: { type: [Number], default: [] }, // Horários disponíveis em minutos [900, 915, ...]
    occupiedSlots: { type: [Number], default: [] }, // Horários ocupados em minutos [930, 945, ...]
}, { timestamps: true });

module.exports = mongoose.model('DailyAvailability', DailyAvailabilitySchema);