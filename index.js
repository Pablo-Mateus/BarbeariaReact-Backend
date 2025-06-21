const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const User = require("./schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authenticateToken = require("./middleware/auth");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/check-auth", authenticateToken, (req, res) => {
  console.log(req.user);
  if (req.user) {
    return res.status(200).json({ isAuthenticated: true, user: req.user.id });
  }
  return res
    .status(401)
    .json({ isAuthenticated: false, message: "Não autenticado" });
});

app.post("/auth/register", async (req, res) => {
  const { nome, email, telefone, senha, confirmarsenha } = req.body;
  console.log(req.body);
  if (!nome) {
    return res.json({ msg: "O nome é obrigatório" });
  }

  if (!email) {
    return res.json({ msg: "O email é obrigatório" });
  }

  if (!senha) {
    return res.status(422).json({ msg: "A senha é obrigatório" });
  }

  if (senha !== confirmarsenha) {
    return res.status(422).json({ msg: "As senhas não conferem" });
  }

  if (senha.length < 10) {
    return res
      .status(422)
      .json({ msg: "A senha deve conter no mínimo 10 caracteres" });
  }

  if (!/[!@#$%&*]/.test(senha)) {
    return res
      .status(422)
      .json({ msg: "A senha deve conter um caractere especial" });
  }

  try {
    //Check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(422).json({ msg: "Por favor utilize outro email." });
    }

    //Create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);

    //Create User
    const user = new User({
      nome,
      email,
      telefone,
      senha: passwordHash,
    });
    await user.save();

    const token = jwt.sign({ id: user.email }, process.env.SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });
    console.log(token);
    const decoded = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Aconteceu um erro no servidor, tente novamente mais tarde.",
    });
  }
});

try {
  mongoose.connect("mongodb://0.0.0.0/BarbeariaReact").then(() => {
    app.listen(port);
    console.log("Conectou ao banco");
  });
} catch (err) {
  console.log(err);
}
