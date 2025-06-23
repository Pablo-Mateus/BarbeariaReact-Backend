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
const noidemailer = require("nodemailer");
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
  if (req.user) {
    return res.status(200).json({ isAuthenticated: true, user: req.user.id });
  }
  return res
    .status(401)
    .json({ isAuthenticated: false, message: "Não autenticado" });
});

app.post("/auth/register", async (req, res) => {
  const { nome, email, telefone, senha, confirmarsenha } = req.body;
  if (!nome) {
    return res.status(422).json({ msg: "O nome é obrigatório" });
  }

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório" });
  }

  if (!senha) {
    return res.status(422).json({ msg: "A senha é obrigatório" });
  }

  if (!telefone) {
    return res.status(422).json({ msg: "O telefone é obrigatório" });
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

    const decoded = jwt.verify(token, process.env.SECRET);

    if (decoded.id === "felipe@gmail.com") {
      return res.status(200).json({
        message: "Autenticado com sucesso",
        token: token,
        redirect: "/logadoBarbeiro",
        decoded,
      });
    }
    return res.status(200).json({
      message: "Autenticado com sucesso",
      token: token,
      redirect: "/logado",
      decoded,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Aconteceu um erro no servidor, tente novamente mais tarde.",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  const { senha, email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Insira seu email" });
  }
  if (!senha) {
    res.status(400).json({ message: "Insira sua senha" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(400).json({ message: "Esse email não existe" });
  }

  const senhaCompare = await bcrypt.compare(senha, user.senha);

  if (!senhaCompare) {
    res.status(400).json({ message: "Senha inválida" });
  }
  if (email !== user.email) {
    res
      .status(400)
      .json({ message: "Não existe usuário cadastrado com esse email" });
  }

  try {
    const token = jwt.sign({ id: user.email }, process.env.SECRET, {
      expiresIn: "1h",
    });

    const decoded = jwt.verify(token, process.env.SECRET);

    if (decoded.id === "felipe@gmail.com") {
      return res.status(200).json({
        message: "Autenticado com sucesso",
        token: token,
        redirect: "/logadoBarbeiro",
        decoded,
      });
    }
    return res.status(200).json({
      message: "Autenticado com sucesso",
      token: token,
      redirect: "/logado",
      decoded,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err });
  }
});

app.post("/resetPassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email não cadastrado!" });
    }

    const transporter = noidemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000;
    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();

    const resetLink = `http://localhost:5000/forgotPass?token=${resetToken}`;
    await transporter.sendMail({
      from: `Suporte <${process.env.USER}>`,
      to: `${user.email}`,
      subject: "Redefinição de senha",
      html: `<p>Para redefinir sua senha, clique no link abaixo: </p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este link expira em 1 hora.</p>
      `,
    });
  } catch (err) {
    console.log(err);
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
