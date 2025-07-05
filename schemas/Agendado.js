const mongoose = require("mongoose");

const agendamentoSchema = new mongoose.Schema({
  nome: String,
  servico: String,
  horario: String,
  tempo: String,
  status: String,
  horarios: Array,
});

const Agendado = mongoose.model("Agendado", agendamentoSchema);

module.exports = Agendado;
