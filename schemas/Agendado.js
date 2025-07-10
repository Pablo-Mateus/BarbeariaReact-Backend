const mongoose = require("mongoose");

const agendadoSchema = new mongoose.Schema({
  dia: { type: String, required: true },
  nome: { type: String, required: true },
  servico: { type: String, required: true },
  horario: { type: String, required: true }, // Ex: "10:00"
  tempo: { type: Number, required: true }, // Duração em minutos
  status: {
    type: String,
    enum: [
      "Pendente",
      "Aceito",
      "Cancelado pelo usuário",
      "Cancelado pelo barbeiro",
    ],
    default: "Pendente",
  },
  horarios: [{ type: String }], // Slots de horário formatados para exibição
  horariosMinutos: [{ type: Number }], // Slots de horário em minutos para controle de disponibilidade
  createdAt: { type: Date, default: Date.now },
});
const Agendado = mongoose.model("Agendado", agendadoSchema);

module.exports = Agendado;
