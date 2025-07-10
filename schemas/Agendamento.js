const mongoose = require("mongoose");


const horarioSchema = new mongoose.Schema({
  diasemana: { type: String, required: true, unique: true },
  inicio: { type: Number, required: true }, // Horário de início em minutos desde a meia-noite
  fim: { type: Number, required: true }, // Horário de fim em minutos desde a meia-noite
  intervalo: { type: Number, required: true }, // Intervalo em minutos
  arraydehorarios: [{ type: Number }], // Todos os slots gerados para o dia em minutos
  disponiveis: [{ type: Number }], // Slots de horário disponíveis em minutos
});
const Horarios = mongoose.model("Horarios", horarioSchema);

module.exports = Horarios;
