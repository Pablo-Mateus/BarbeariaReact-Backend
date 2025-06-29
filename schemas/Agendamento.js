const mongoose = require("mongoose");

const HorariosSchema = new mongoose.Schema({
  diasemana: String,
  inicio: Number,
  fim: Number,
  intervalo: Number,
  arraydehorarios: [],
});

const Horarios = mongoose.model("Horarios", AgendamentoSchema);

module.exports = Horarios;
