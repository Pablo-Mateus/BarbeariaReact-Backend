const mongoose = require("mongoose");

const servicoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  duracao: Number,
  preco: Number,
});

const Servico = mongoose.model("Servico", servicoSchema);

module.exports = Servico;
