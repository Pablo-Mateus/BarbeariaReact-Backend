const mongoose = require("mongoose");

const agendamentoSchema = new mongoose.Schema({
  dia: String,
  nome: String,
  servico: String,
  horario: String,
  termino: String,
  tempo: String,
  status: String,
  horarios: Array,
  horariosMinutos: Array,
  createdAt: Date,
  isArchived: {type: Boolean, default: false},
});

const Agendado = mongoose.model("Agendado", agendamentoSchema);

module.exports = Agendado;
