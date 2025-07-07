const mongoose = require("mongoose");

const agendamentoSchema = new mongoose.Schema({
  nome: String,
  servico: String,
  horario: String,
  termino: String,
  tempo: String,
  status: String,
  horarios: Array,
  horariosMinutos: Array,
});

const Agendado = mongoose.model("Agendado", agendamentoSchema);

module.exports = Agendado;
