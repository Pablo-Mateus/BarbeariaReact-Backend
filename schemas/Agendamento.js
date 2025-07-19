const mongoose = require("mongoose");

const HorariosSchema = new mongoose.Schema({
  diasemana: String,
  inicio: Number,
  fim: Number,
  intervalo: Number,
});

const Horarios = mongoose.model("Horarios", HorariosSchema);

module.exports = Horarios;
