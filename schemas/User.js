const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  telefone: String,
  senha: String,
  confirmarsenha: String,
  resetToken: String,
  resetTokenExpire: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
