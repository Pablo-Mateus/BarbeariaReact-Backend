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
});

const Agendado = mongoose.model("Agendado", agendamentoSchema);

module.exports = Agendado;
