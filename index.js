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
const crypto = require("crypto");
const criarHorario = require("./schemas/Agendamento");
const Horarios = require("./schemas/Agendamento");
const Agendado = require("./schemas/Agendado");
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

app.post("/archiveCanceledSchedules", authenticateToken, async (req, res) => {
  try {
    await Agendado.updateMany(
      { nome: req.user.name, status: "Cancelado pelo usuário" },
      {
        $set: { isArchived: true },
      }
    );
    res.status(200).json({ message: "Arquivamento realizado com sucesso!" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Não foi possível arquivar os agendamentos", err });
  }
});

app.post("/confirmSchedule", authenticateToken, async (req, res) => {
  const { agendamentoId } = req.body;
  try {
    await Agendado.updateOne(
      { _id: agendamentoId },
      {
        $set: { status: "Aceito" },
      }
    );
    res.status(200).json({ message: "Agendamento aceito!" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.post("/deleteSchedule", authenticateToken, async (req, res) => {
  try {
    await Agendado.deleteMany({ status: "Cancelado pelo usuário" });
    return res
      .status(200)
      .json({ message: "Agendamentos cancelados com sucesso!" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
  }
});

app.post("/cancelSchedule", authenticateToken, async (req, res) => {
  try {
    const { agendamentoId } = req.body;
    const agendado = await Agendado.findById(agendamentoId);

    const adicionarHorarios = await Horarios.findOne({
      diasemana: agendado.dia,
    });

    const horariosCancelados = agendado.horariosMinutos;
    const horariosAtuais = adicionarHorarios.disponiveis;

    await Horarios.updateOne(
      { diasemana: agendado.dia },
      { $push: { disponiveis: { $each: horariosCancelados, $sort: 1 } } }
    );

    await Agendado.updateOne(
      {
        _id: agendamentoId,
      },
      {
        $set: { status: "Cancelado pelo usuário" },
      }
    );

    return res
      .status(200)
      .json({ message: "Agendamento cancelado com sucesso" });
  } catch (err) {
    console.log(err);
  }
});

app.get("/showSchedule", authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== process.env.ADMIN_EMAIL) {
      const agendado = await Agendado.find({ nome: req.user.name });
      return res.status(200).json({ usuario: agendado });
    } else {
      const agendado = await Agendado.find();
      return res.status(200).json({ usuario: agendado });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
  }
});

app.post("/createSchedule", authenticateToken, async (req, res) => {
  const { tempo, value, servico, hora, diaSemana, date } = req.body;

  const horario = await Horarios.findOne({ diasemana: diaSemana });

  const minutoServico = tempo + req.body.hora;

  const arrayFormat = [];
  const arrayMinutos = [];
  for (let i = tempo; i <= minutoServico; i += horario.intervalo) {
    arrayMinutos.push(i);
    const horaFormat = Math.floor(i / 60).toString();
    const minutoFormat = (i % 60).toString().padStart(2, "0");
    arrayFormat.push(`${horaFormat}:${minutoFormat}`);
  }

  if (!tempo) {
    return res.status(400).json({
      message: "Para criar um agendamento é necessário selecionar um horário.",
    });
  }
  if (!servico) {
    return res.status(400).json({
      message: "Para criar um agendamento é necessário selecionar um serviço.",
    });
  }
  try {
    const agendado = new Agendado({
      dia: diaSemana,
      nome: req.user.name,
      servico,
      horario: tempo,
      tempo: hora,
      status: "Aguardando aceite",
      horarios: arrayFormat,
      horariosMinutos: arrayMinutos,
      createdAt: date,
    });

    await agendado.save();

    await Horarios.updateOne(
      { diasemana: diaSemana },
      {
        $pull: { disponiveis: { $in: arrayMinutos } },
      }
    );

    return res.status(200).json({ message: "Agendamento criado com sucesso!" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/dayAvailability", async (req, res) => {
  const currentDate = req.body.date;
  const currentDia = req.body.dia;
  try {
    const agendado = await Agendado.findOne({
      createdAt: currentDate,
      status: "Aguardando aceite",
    });
    if (agendado) {
      const template = await Horarios.findOne({ diasemana: currentDia });
      const arrayAgendado = agendado.horariosMinutos;
      const horainicio = template.inicio;
      const horaFim = template.fim;
      const templateIntervalo = template.intervalo;
      const arraySlots = [];
      for (let i = horainicio; i <= horaFim; i += templateIntervalo) {
        arraySlots.push(i);
      }
      const setRemove = new Set(arrayAgendado);
      const arrayResult = arraySlots.filter((item) => !setRemove.has(item));
      return res.status(200).json({ horarios: arrayResult });
    }

    if (!agendado) {
      const template = await Horarios.findOne({ diasemana: currentDia });
    
      const horainicio = template.inicio;
      const horaFim = template.fim;
      const templateIntervalo = template.intervalo;
      const arraySlots = [];
      for (let i = horainicio; i <= horaFim; i += templateIntervalo) {
        arraySlots.push(i);
      }
      return res.status(200).json({ horarios: arraySlots });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Erro ao procurar horários disponíveis" });
  }
});

app.post("/getTimes", async (req, res) => {
  const diasemana = req.body.dia;

  try {
    const availableTime = await Horarios.findOne({ diasemana: diasemana });

    const startTime = `${Math.floor(availableTime.inicio / 60)}:${(
      availableTime.inicio % 60
    )
      .toString()
      .padStart(2, "0")}`;
    const lastTime = `${Math.floor(availableTime.fim / 60)}:${(
      availableTime.fim % 60
    )
      .toString()
      .padStart(2, "0")}`;

    return res.status(200).json({
      inicio: startTime,
      fim: lastTime,
      intervalo: availableTime.intervalo,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Não existem horários para a data selecionada!" });
  }
});

app.post("/DefinirHorario", authenticateToken, async (req, res) => {
  const inicioMinutos =
    +req.body.inicio.split(":")[0] * 60 + +req.body.inicio.split(":")[1];
  const fimMinutos =
    +req.body.fim.split(":")[0] * 60 + +req.body.fim.split(":")[1];
  const intervalo = +req.body.intervalo;

  let minutosTotais;

  if (inicioMinutos > fimMinutos) {
    return res.status(400).json({
      message: "Inicio do expediente maior que o encerramento!",
    });
  }

  if (fimMinutos > inicioMinutos) {
    minutosTotais = fimMinutos - inicioMinutos;
  } else {
    minutosTotais = 1440 - inicioMinutos + fimMinutos;
  }
  let slotsHorario = [];
  for (
    let minutoAtual = inicioMinutos;
    minutoAtual <= inicioMinutos + minutosTotais;
    minutoAtual += intervalo
  ) {
    let minutoAtualDia = minutoAtual % 1440;
    slotsHorario.push(minutoAtualDia);
  }

  const exists = await criarHorario.findOne({
    diasemana: req.body.diaSemana,
  });

  if (exists) {
    await criarHorario.updateOne(
      { diasemana: req.body.diaSemana },
      {
        $set: {
          inicio: inicioMinutos,
          fim: fimMinutos,
          intervalo: intervalo,
          arraydehorarios: slotsHorario,
          disponiveis: slotsHorario,
        },
      }
    );
    return res
      .status(200)
      .json({ message: "Horários atualizados com sucesso!" });
  }

  if (!exists) {
    try {
      const horario = new criarHorario({
        diasemana: req.body.diaSemana,
        inicio: inicioMinutos,
        fim: fimMinutos,
        intervalo: intervalo,
        arraydehorarios: slotsHorario,
        disponiveis: slotsHorario,
      });
      await horario.save();
      return res.status(200).json({ message: "Horários criados com sucesso!" });
    } catch (err) {
      console.log(err);
      return res
        .status(200)
        .json({ message: `Ocorreu um erro ao criar horários` });
    }
  }
});

app.get("/check-auth", authenticateToken, (req, res) => {
  if (req.user) {
    return res
      .status(200)
      .json({ isAuthenticated: true, user: req.user.id, name: req.user });
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

    const token = jwt.sign(
      { id: user.email, name: user.nome },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );

    const decoded = jwt.verify(token, process.env.SECRET);

    if (decoded.id === process.env.ADMIN_EMAIL) {
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
    return res.status(500).json({
      msg: `Aconteceu um erro no servidor, tente novamente mais tarde.${error}`,
    });
  }
});

app.post("/auth/login", async (req, res) => {
  const { senha, email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Insira seu email" });
  }
  if (!senha) {
    return res.status(400).json({ message: "Insira sua senha" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: "Esse email não existe" });
  }

  const senhaCompare = await bcrypt.compare(senha, user.senha);

  if (!senhaCompare) {
    return res.status(400).json({ message: "Senha inválida" });
  }
  if (email !== user.email) {
    return res
      .status(400)
      .json({ message: "Não existe usuário cadastrado com esse email" });
  }

  try {
    const token = jwt.sign(
      { id: user.email, name: user.nome },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );

    const decoded = jwt.verify(token, process.env.SECRET);

    if (decoded.id === process.env.ADMIN_EMAIL) {
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
    return res.status(404).json({ message: err });
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

    const resetLink = `http://localhost:5173/forgotPass?token=${resetToken}`;

    await transporter.sendMail({
      from: `Suporte <${process.env.USER}>`,
      to: `${user.email}`,
      subject: "Redefinição de senha",
      html: `<p>Para redefinir sua senha, clique no link abaixo: </p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este link expira em 1 hora.</p>
      `,
    });

    return res.status(200).json({ message: "Email enviado com sucesso" });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Falha ao enviar email do servidor" });
    console.log(err);
  }
});

app.post("/changePass", async (req, res) => {
  const { senha, confirmarsenha, token } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  const compare = await bcrypt.compare(senha, user.senha);

  if (compare) {
    return res
      .status(400)
      .json({ msg: "A senha que você digitou é igual a anterior!" });
  }

  if (!user) {
    return res.status(400).json({
      msg: "Token inválido ou expirado, gere um novo link",
      isAuthenticated: false,
    });
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

  if (senha !== confirmarsenha) {
    return res.status(400).json({ msg: "As senhas não condicem" });
  }

  try {
    const salt = await bcrypt.genSalt(12);
    user.senha = await bcrypt.hash(senha, salt);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    return res.status(200).json({ msg: "Senha redefinida com sucesso!" });
  } catch (err) {
    return res.status(500).json({ msg: "Erro ao redefinir senha" });
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
