const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;
const mongoose = require("mongoose");
const forms = require("./schemas/Forms");

app.get("/", (req, res) => {
  res.json({ msg: "Resposta da api" });
});

app.post("/dados", async (req, res) => {
  const { name, sobrenome, endereco, telefone } = req.body;

  try {
    const formularioBanco = new forms({ name, sobrenome, endereco, telefone });
    const user = await forms.findOne({
      name: name,
    });

    if (!user) {
      await formularioBanco.save();
      console.log("Usuário criado com sucesso");
    } else {
      console.log("Usuário já cadastrado");
    }
    
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
