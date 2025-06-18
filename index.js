const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;
const mongoose = require("mongoose");
const forms = require("./schemas/Forms");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
  console.log(req.body);
  if (!name) {
    return res.json({ msg: "O nome é obrigatório" });
  }

  if (!email) {
    return res.json({ msg: "O email é obrigatório" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatório" });
  }

  if (password !== confirmpassword) {
    return res.status(422).json({ msg: "As senhas não conferem" });
  }

  if (password.length < 10) {
    return res
      .status(422)
      .json({ msg: "A senha deve conter no mínimo 10 caracteres" });
  }

  if (!/[!@#$%&*]/.test(password)) {
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
    const passwordHash = await bcrypt.hash(password, salt);

    //Create User
    const user = new User({
      name,
      email,
      phone: req.body.tel,
      password: passwordHash,
    });
    await user.save();

    const token = jwt.sign({ id: user.email }, process.env.SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    const decoded = jwt.verify(token, process.env.SECRET);

    if (decoded.id === "felipe@gmail.com") {
      res.status(200).json({ redirect: "/logadoBarbeiro" });
    }
    if (decoded.id !== "felipe@gmail.com") {
      res.status(200).json({ redirect: "/logado" });
    }
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
