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
const authenticateToken = require("./middleware/auth"); // Assumindo que este middleware existe
const nodemailer = require("nodemailer"); // Corrigido de noidemailer para nodemailer
const crypto = require("crypto");
const criarHorario = require("./schemas/Agendamento"); // Esquema para horários de barbearia
const Horarios = require("./schemas/Agendamento"); // Esquema para horários disponíveis (parece ser o mesmo que criarHorario)
const Agendado = require("./schemas/Agendado"); // Esquema para agendamentos feitos por usuários

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

// Conexão com o MongoDB
try {
  mongoose.connect("mongodb://0.0.0.0/BarbeariaReact").then(() => {
    app.listen(port);
    console.log("Conectado ao banco de dados MongoDB!");
  });
} catch (err) {
  console.error("Erro ao conectar ao banco de dados:", err);
}

// --- Rotas da API ---

// Rota para cancelar um agendamento
app.post("/cancelSchedule", authenticateToken, async (req, res) => {
  try {
    const { agendamentoId } = req.body;
    const agendado = await Agendado.findById(agendamentoId);

    if (!agendado) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }

    // Se o agendamento já foi cancelado ou aceito, não permite cancelar novamente
    if (
      agendado.status === "Cancelado pelo usuário" ||
      agendado.status === "Cancelado pelo barbeiro" ||
      agendado.status === "Aceito"
    ) {
      return res
        .status(400)
        .json({ message: `Agendamento já está ${agendado.status}.` });
    }

    const adicionarHorarios = await Horarios.findOne({
      diasemana: agendado.dia,
    });

    if (adicionarHorarios) {
      const horariosCancelados = agendado.horariosMinutos;
      const horariosAtuais = adicionarHorarios.disponiveis;

      // Adiciona os horários cancelados de volta aos disponíveis e os ordena
      const horariosOrdenados = [...horariosAtuais, ...horariosCancelados].sort(
        (a, b) => a - b
      );

      await Horarios.updateOne(
        { diasemana: agendado.dia },
        { $set: { disponiveis: horariosOrdenados } }
      );
    } else {
      console.warn(
        `Nenhum registro de horários para o dia ${agendado.dia} encontrado ao cancelar agendamento.`
      );
    }

    await Agendado.findByIdAndUpdate(agendamentoId, {
      $set: { status: "Cancelado pelo usuário" },
    });

    return res
      .status(200)
      .json({ message: "Agendamento cancelado com sucesso!" });
  } catch (err) {
    console.error("Erro ao cancelar agendamento:", err);
    return res
      .status(500)
      .json({ message: "Erro interno do servidor ao cancelar agendamento." });
  }
});

// Rota para exibir agendamentos (histórico)
app.get("/showSchedule", authenticateToken, async (req, res) => {
  try {
    // Verifica se o usuário autenticado é o administrador
    if (req.user.id === process.env.ADMIN_EMAIL) {
      const agendados = await Agendado.find({}); // Pega todos os agendamentos para o admin
      return res.status(200).json({ usuario: agendados }); // Retorna como 'usuario' para consistência no frontend
    } else {
      // Para usuários comuns, busca agendamentos pelo nome
      const agendados = await Agendado.find({ nome: req.user.name });
      return res.status(200).json({ usuario: agendados });
    }
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    return res
      .status(500)
      .json({ message: "Erro interno do servidor ao buscar agendamentos." });
  }
});

// Rota para criar um agendamento
app.post("/createSchedule", authenticateToken, async (req, res) => {
  const { tempo, servico, hora, diaSemana } = req.body;

  const convertHora = +tempo.split(":")[0] * 60;
  const convertMinuto = +tempo.split(":")[1];
  const minutoTotal = convertHora + convertMinuto;
  const minutoServico = minutoTotal + +hora; // Usar 'hora' do req.body diretamente

  const arrayFormat = [];
  const arrayMinutos = [];
  // Assumindo que 'intervalo' também virá no req.body ou será um valor padrão
  const intervaloAgendamento = req.body.intervalo || 30; // Defina um padrão, se necessário

  for (
    let i = minutoTotal;
    i < minutoTotal + hora; // Corrigido para ir até o fim do serviço, não incluindo o último slot de 'fim'
    i += intervaloAgendamento
  ) {
    arrayMinutos.push(i);
    const horaFormat = Math.floor(i / 60).toString();
    const minutoFormat = (i % 60).toString().padStart(2, "0");
    arrayFormat.push(`${horaFormat}:${minutoFormat}`);
  }

  // Adiciona o último slot do serviço
  const lastHour = Math.floor(minutoTotal + hora / 60).toString();
  const lastMinute = ((minutoTotal + hora) % 60).toString().padStart(2, "0");
  if (!arrayFormat.includes(`${lastHour}:${lastMinute}`)) {
    arrayFormat.push(`${lastHour}:${lastMinute}`);
    arrayMinutos.push(minutoTotal + hora);
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
      horario: tempo, // Horário de início selecionado
      tempo: hora, // Duração do serviço em minutos
      status: "Pendente", // Status inicial "Pendente"
      horarios: arrayFormat, // Array de slots de horário formatados (ex: ["10:00", "10:30"])
      horariosMinutos: arrayMinutos, // Array de slots de horário em minutos
    });

    await agendado.save();

    // Remove os horários agendados dos horários disponíveis
    await Horarios.updateOne(
      { diasemana: diaSemana },
      {
        $pull: { disponiveis: { $in: arrayMinutos } },
      }
    );

    return res.status(200).json({ message: "Agendamento criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar agendamento:", err);
    return res
      .status(500)
      .json({ message: "Erro interno do servidor ao criar agendamento." });
  }
});

// Rota para obter horários disponíveis para um dia específico
app.post("/getTimes", async (req, res) => {
  try {
    const horario = await Horarios.findOne({
      diasemana: req.body.dia,
    });

    if (!horario) {
      return res
        .status(404) // Mudado para 404 pois o recurso não foi encontrado
        .json({ message: "Nenhum horário encontrado para o dia selecionado." });
    }

    // Formata horários disponíveis de minutos para HH:MM
    let disponivel = horario.disponiveis.map((item) => {
      const horas = Math.floor(item / 60);
      const minutos = item % 60;
      return `${horas.toString().padStart(2, "0")}:${minutos
        .toString()
        .padStart(2, "0")}`;
    });

    return res.status(200).json({
      horarios: disponivel, // Retornando apenas os horários disponíveis
      intervalo: horario.intervalo,
      disponiveis: disponivel, // Duplicado, pode ser apenas 'horarios'
    });
  } catch (err) {
    console.error("Erro ao obter horários:", err);
    return res
      .status(500)
      .json({ message: "Erro interno do servidor ao obter horários." });
  }
});

// Rota para o barbeiro definir horários de expediente
app.post("/DefinirHorario", async (req, res) => {
  const { inicio, fim, intervalo, diaSemana } = req.body;

  const inicioMinutos = +inicio.split(":")[0] * 60 + +inicio.split(":")[1];
  const fimMinutos = +fim.split(":")[0] * 60 + +fim.split(":")[1];
  const intervaloNum = +intervalo;

  if (inicioMinutos >= fimMinutos) {
    return res.status(400).json({
      message: "O horário de início do expediente deve ser anterior ao de encerramento!",
    });
  }

  let slotsHorario = [];
  for (
    let minutoAtual = inicioMinutos;
    minutoAtual < fimMinutos; // O último slot não deve ultrapassar o fim
    minutoAtual += intervaloNum
  ) {
    slotsHorario.push(minutoAtual);
  }

  try {
    const exists = await Horarios.findOne({
      diasemana: diaSemana,
    });

    if (exists) {
      // Atualiza horários existentes
      await Horarios.updateOne(
        { diasemana: diaSemana },
        {
          $set: {
            inicio: inicioMinutos,
            fim: fimMinutos,
            intervalo: intervaloNum,
            arraydehorarios: slotsHorario,
            disponiveis: slotsHorario, // Reinicia os disponíveis
          },
        }
      );
      return res
        .status(200)
        .json({ message: "Horários atualizados com sucesso!" });
    } else {
      // Cria novos horários
      const horario = new Horarios({
        diasemana: diaSemana,
        inicio: inicioMinutos,
        fim: fimMinutos,
        intervalo: intervaloNum,
        arraydehorarios: slotsHorario,
        disponiveis: slotsHorario,
      });
      await horario.save();
      return res.status(201).json({ message: "Horários criados com sucesso!" }); // 201 para recurso criado
    }
  } catch (err) {
    console.error("Erro ao definir horários:", err);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao definir os horários." });
  }
});

// Rota para verificar autenticação
app.get("/check-auth", authenticateToken, (req, res) => {
  if (req.user) {
    return res.status(200).json({
      isAuthenticated: true,
      user: req.user.id,
      name: req.user.name, // Retornar req.user.name para ser mais útil
    });
  }
  return res
    .status(401)
    .json({ isAuthenticated: false, message: "Não autenticado" });
});

// Rota de registro de usuário
app.post("/auth/register", async (req, res) => {
  const { nome, email, telefone, senha, confirmarsenha } = req.body;

  // Validações
  if (!nome) return res.status(422).json({ msg: "O nome é obrigatório!" });
  if (!email) return res.status(422).json({ msg: "O email é obrigatório!" });
  if (!telefone) return res.status(422).json({ msg: "O telefone é obrigatório!" });
  if (!senha) return res.status(422).json({ msg: "A senha é obrigatória!" });
  if (senha !== confirmarsenha) return res.status(422).json({ msg: "As senhas não conferem!" });
  if (senha.length < 10) return res.status(422).json({ msg: "A senha deve conter no mínimo 10 caracteres!" });
  if (!/[!@#$%&*]/.test(senha)) return res.status(422).json({ msg: "A senha deve conter pelo menos um caractere especial (!@#$%&*)." });

  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(409).json({ msg: "Este email já está cadastrado. Por favor, utilize outro." }); // 409 Conflict
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);

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
      { expiresIn: "1h" }
    );

    // Redirecionamento baseado no tipo de usuário (admin ou comum)
    if (user.email === process.env.ADMIN_EMAIL) {
      return res.status(201).json({
        message: "Administrador registrado e autenticado com sucesso!",
        token: token,
        redirect: "/logadoBarbeiro",
      });
    } else {
      return res.status(201).json({
        message: "Usuário registrado e autenticado com sucesso!",
        token: token,
        redirect: "/logado",
      });
    }
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({
      msg: `Ocorreu um erro no servidor ao registrar. Tente novamente mais tarde.`,
    });
  }
});

// Rota de login de usuário
app.post("/auth/login", async (req, res) => {
  const { senha, email } = req.body;

  if (!email) return res.status(400).json({ message: "O email é obrigatório." });
  if (!senha) return res.status(400).json({ message: "A senha é obrigatória." });

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: "Email não cadastrado." });
  }

  const senhaCompare = await bcrypt.compare(senha, user.senha);
  if (!senhaCompare) {
    return res.status(401).json({ message: "Senha inválida." });
  }

  try {
    const token = jwt.sign(
      { id: user.email, name: user.nome },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    if (user.email === process.env.ADMIN_EMAIL) {
      return res.status(200).json({
        message: "Administrador autenticado com sucesso!",
        token: token,
        redirect: "/logadoBarbeiro",
      });
    } else {
      return res.status(200).json({
        message: "Usuário autenticado com sucesso!",
        token: token,
        redirect: "/logado",
      });
    }
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ message: "Erro interno do servidor ao fazer login." });
  }
});

// Rota para solicitação de redefinição de senha
app.post("/resetPassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Email não cadastrado!" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // Usar uma variável de ambiente mais específica
        pass: process.env.EMAIL_PASS, // Usar uma variável de ambiente mais específica
      },
    });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000; // 1 hora de expiração
    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();

    const resetLink = `http://localhost:5173/forgotPass?token=${resetToken}`;

    await transporter.sendMail({
      from: `Suporte Barbearia <${process.env.EMAIL_USER}>`,
      to: `${user.email}`,
      subject: "Redefinição de senha",
      html: `<p>Para redefinir sua senha, clique no link abaixo:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Este link expira em 1 hora.</p>`,
    });

    return res.status(200).json({ message: "Email de redefinição de senha enviado com sucesso!" });
  } catch (err) {
    console.error("Erro ao enviar email de redefinição:", err);
    return res.status(500).json({ message: "Falha ao enviar email do servidor." });
  }
});

// Rota para redefinir a senha
app.post("/changePass", async (req, res) => {
  const { senha, confirmarsenha, token } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }, // Token válido e não expirado
  });

  if (!user) {
    return res.status(400).json({
      msg: "Token inválido ou expirado. Por favor, gere um novo link de redefinição.",
      isAuthenticated: false,
    });
  }

  const compare = await bcrypt.compare(senha, user.senha);
  if (compare) {
    return res.status(400).json({ msg: "A nova senha não pode ser igual à senha anterior!" });
  }

  // Validações da nova senha
  if (senha.length < 10) {
    return res.status(422).json({ msg: "A senha deve conter no mínimo 10 caracteres." });
  }
  if (!/[!@#$%&*]/.test(senha)) {
    return res.status(422).json({ msg: "A senha deve conter pelo menos um caractere especial (!@#$%&*)." });
  }
  if (senha !== confirmarsenha) {
    return res.status(400).json({ msg: "As senhas não coincidem." });
  }

  try {
    const salt = await bcrypt.genSalt(12);
    user.senha = await bcrypt.hash(senha, salt);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    return res.status(200).json({ msg: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("Erro ao redefinir senha:", err);
    return res.status(500).json({ msg: "Erro interno do servidor ao redefinir a senha." });
  }
});



// Exemplo de esquema Horarios (se não tiver)
/*
const horarioSchema = new mongoose.Schema({
  diasemana: { type: String, required: true, unique: true },
  inicio: { type: Number, required: true }, // Horário de início em minutos desde a meia-noite
  fim: { type: Number, required: true }, // Horário de fim em minutos desde a meia-noite
  intervalo: { type: Number, required: true }, // Intervalo em minutos
  arraydehorarios: [{ type: Number }], // Todos os slots gerados para o dia em minutos
  disponiveis: [{ type: Number }], // Slots de horário disponíveis em minutos
});
const Horarios = mongoose.model('Horarios', horarioSchema);
*/