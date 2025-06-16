const mongoose = require("mongoose");

const formularioSchema = new mongoose.Schema({
  name: String,
  sobrenome: String,
  endereco: String,
  telefone: String,
});

const forms = mongoose.model("Formulario", formularioSchema);

module.exports = forms;
