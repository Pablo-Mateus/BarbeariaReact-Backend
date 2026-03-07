import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import 'dotenv/config';
import User from './schemas/User.js';
import Horarios from './schemas/Agendamento.js';
import Agendado from './schemas/Agendado.js';
import authenticateToken from './middleware/auth.js';
const app = express();
const port = 5000;
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(cookieParser());
// Archive canceled schedules
app.post('/archiveCanceledSchedules', authenticateToken, async (req, res) => {
    try {
        await Agendado.updateMany({ nome: req.user?.name, status: 'Cancelado pelo usuário' }, { $set: { isArchived: true } });
        res.status(200).json({ message: 'Arquivamento realizado com sucesso!' });
    }
    catch (err) {
        res.status(400).json({ message: 'Não foi possível arquivar os agendamentos', err });
    }
});
// Confirm schedule
app.post('/confirmSchedule', authenticateToken, async (req, res) => {
    const { agendamentoId } = req.body;
    try {
        await Agendado.updateOne({ _id: agendamentoId }, { $set: { status: 'Aceito' } });
        res.status(200).json({ message: 'Agendamento aceito!' });
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
});
// Delete schedule
app.post('/deleteSchedule', authenticateToken, async (_req, res) => {
    try {
        await Agendado.deleteMany({ status: 'Cancelado pelo usuário' });
        res.status(200).json({ message: 'Agendamentos cancelados com sucesso!' });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
});
// Cancel schedule
app.post('/cancelSchedule', authenticateToken, async (req, res) => {
    try {
        const { agendamentoId } = req.body;
        const agendado = await Agendado.findById(agendamentoId);
        if (!agendado) {
            res.status(404).json({ message: 'Agendamento não encontrado' });
            return;
        }
        const adicionarHorarios = await Horarios.findOne({
            diasemana: agendado.dia,
        });
        if (!adicionarHorarios) {
            res.status(404).json({ message: 'Horários não encontrados' });
            return;
        }
        const horariosCancelados = agendado.horariosMinutos;
        await Horarios.updateOne({ diasemana: agendado.dia }, { $push: { disponiveis: { $each: horariosCancelados, $sort: 1 } } });
        await Agendado.updateOne({ _id: agendamentoId }, { $set: { status: 'Cancelado pelo usuário' } });
        res.status(200).json({ message: 'Agendamento cancelado com sucesso' });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Erro ao cancelar agendamento' });
    }
});
// Show schedule
app.get('/showSchedule', authenticateToken, async (req, res) => {
    try {
        if (req.user?.id !== process.env.ADMIN_EMAIL) {
            const agendado = await Agendado.find({ nome: req.user?.name });
            res.status(200).json({ usuario: agendado });
            return;
        }
        const agendado = await Agendado.find();
        res.status(200).json({ usuario: agendado });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
});
// Create schedule
app.post('/createSchedule', authenticateToken, async (req, res) => {
    const { tempo, servico, hora, diaSemana, date } = req.body;
    const horario = await Horarios.findOne({ diasemana: diaSemana });
    if (!horario) {
        res.status(404).json({ message: 'Horário não encontrado para o dia selecionado' });
        return;
    }
    const minutoServico = tempo + hora;
    const arrayFormat = [];
    const arrayMinutos = [];
    for (let i = tempo; i <= minutoServico; i += horario.intervalo) {
        arrayMinutos.push(i);
        const horaFormat = Math.floor(i / 60).toString();
        const minutoFormat = (i % 60).toString().padStart(2, '0');
        arrayFormat.push(`${horaFormat}:${minutoFormat}`);
    }
    if (!tempo) {
        res.status(400).json({
            message: 'Para criar um agendamento é necessário selecionar um horário.',
        });
        return;
    }
    if (!servico) {
        res.status(400).json({
            message: 'Para criar um agendamento é necessário selecionar um serviço.',
        });
        return;
    }
    try {
        const agendado = new Agendado({
            dia: diaSemana,
            nome: req.user?.name,
            servico,
            horario: tempo.toString(),
            tempo: hora.toString(),
            status: 'Aguardando aceite',
            horarios: arrayFormat,
            horariosMinutos: arrayMinutos,
            createdAt: date,
        });
        await agendado.save();
        await Horarios.updateOne({ diasemana: diaSemana }, { $pull: { disponiveis: { $in: arrayMinutos } } });
        res.status(200).json({ message: 'Agendamento criado com sucesso!' });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Erro ao criar agendamento' });
    }
});
// Day availability
app.post('/dayAvailability', async (req, res) => {
    const { date: currentDate, dia: currentDia } = req.body;
    try {
        const agendado = await Agendado.findOne({
            createdAt: currentDate,
            status: 'Aguardando aceite',
        });
        if (agendado) {
            const template = await Horarios.findOne({ diasemana: currentDia });
            if (!template) {
                res.status(404).json({ message: 'Template não encontrado' });
                return;
            }
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
            res.status(200).json({ horarios: arrayResult });
            return;
        }
        const template = await Horarios.findOne({ diasemana: currentDia });
        if (!template) {
            res.status(404).json({ message: 'Template não encontrado' });
            return;
        }
        const horainicio = template.inicio;
        const horaFim = template.fim;
        const templateIntervalo = template.intervalo;
        const arraySlots = [];
        for (let i = horainicio; i <= horaFim; i += templateIntervalo) {
            arraySlots.push(i);
        }
        res.status(200).json({ horarios: arraySlots });
    }
    catch (err) {
        res.status(400).json({ message: 'Erro ao procurar horários disponíveis' });
    }
});
// Get times
app.post('/getTimes', async (req, res) => {
    const { dia: diasemana } = req.body;
    try {
        const availableTime = await Horarios.findOne({ diasemana });
        if (!availableTime) {
            res.status(400).json({ message: 'Não existem horários para a data selecionada!' });
            return;
        }
        const startTime = `${Math.floor(availableTime.inicio / 60)}:${(availableTime.inicio % 60)
            .toString()
            .padStart(2, '0')}`;
        const lastTime = `${Math.floor(availableTime.fim / 60)}:${(availableTime.fim % 60)
            .toString()
            .padStart(2, '0')}`;
        res.status(200).json({
            inicio: startTime,
            fim: lastTime,
            intervalo: availableTime.intervalo,
        });
    }
    catch (err) {
        res.status(400).json({ message: 'Não existem horários para a data selecionada!' });
    }
});
// Define schedule
app.post('/DefinirHorario', authenticateToken, async (req, res) => {
    const { inicio, fim, intervalo: intervaloStr, diaSemana } = req.body;
    const inicioMinutos = +inicio.split(':')[0] * 60 + +inicio.split(':')[1];
    const fimMinutos = +fim.split(':')[0] * 60 + +fim.split(':')[1];
    const intervalo = +intervaloStr;
    let minutosTotais;
    if (inicioMinutos > fimMinutos) {
        res.status(400).json({
            message: 'Inicio do expediente maior que o encerramento!',
        });
        return;
    }
    if (fimMinutos > inicioMinutos) {
        minutosTotais = fimMinutos - inicioMinutos;
    }
    else {
        minutosTotais = 1440 - inicioMinutos + fimMinutos;
    }
    const slotsHorario = [];
    for (let minutoAtual = inicioMinutos; minutoAtual <= inicioMinutos + minutosTotais; minutoAtual += intervalo) {
        const minutoAtualDia = minutoAtual % 1440;
        slotsHorario.push(minutoAtualDia);
    }
    const exists = await Horarios.findOne({ diasemana: diaSemana });
    if (exists) {
        await Horarios.updateOne({ diasemana: diaSemana }, {
            $set: {
                inicio: inicioMinutos,
                fim: fimMinutos,
                intervalo: intervalo,
                arraydehorarios: slotsHorario,
                disponiveis: slotsHorario,
            },
        });
        res.status(200).json({ message: 'Horários atualizados com sucesso!' });
        return;
    }
    try {
        const horario = new Horarios({
            diasemana: diaSemana,
            inicio: inicioMinutos,
            fim: fimMinutos,
            intervalo: intervalo,
            arraydehorarios: slotsHorario,
            disponiveis: slotsHorario,
        });
        await horario.save();
        res.status(200).json({ message: 'Horários criados com sucesso!' });
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ message: 'Ocorreu um erro ao criar horários' });
    }
});
// Check auth
app.get('/check-auth', authenticateToken, (req, res) => {
    if (req.user) {
        console.log('[DEBUG check-auth] req.user.id:', JSON.stringify(req.user.id));
        console.log('[DEBUG check-auth] ADMIN_EMAIL:', JSON.stringify(process.env.ADMIN_EMAIL));
        console.log('[DEBUG check-auth] Match:', req.user.id === process.env.ADMIN_EMAIL);
        const isAdmin = req.user.id === process.env.ADMIN_EMAIL;
        res.status(200).json({ isAuthenticated: true, user: req.user.id, name: req.user, isAdmin });
        return;
    }
    res.status(401).json({ isAuthenticated: false, message: 'Não autenticado' });
});
// Register
app.post('/auth/register', async (req, res) => {
    const { nome, email, telefone, senha, confirmarsenha } = req.body;
    if (!nome) {
        res.status(422).json({ msg: 'O nome é obrigatório' });
        return;
    }
    if (!email) {
        res.status(422).json({ msg: 'O email é obrigatório' });
        return;
    }
    if (!senha) {
        res.status(422).json({ msg: 'A senha é obrigatório' });
        return;
    }
    if (!telefone) {
        res.status(422).json({ msg: 'O telefone é obrigatório' });
        return;
    }
    if (senha !== confirmarsenha) {
        res.status(422).json({ msg: 'As senhas não conferem' });
        return;
    }
    if (senha.length < 10) {
        res.status(422).json({ msg: 'A senha deve conter no mínimo 10 caracteres' });
        return;
    }
    if (!/[!@#$%&*]/.test(senha)) {
        res.status(422).json({ msg: 'A senha deve conter um caractere especial' });
        return;
    }
    try {
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            res.status(422).json({ msg: 'Por favor utilize outro email.' });
            return;
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
        const confirmToken = crypto.randomBytes(32).toString('hex');
        const confirmTokenExpire = new Date(Date.now() + 3600000);
        user.confirmToken = confirmToken;
        user.confirmTokenExpire = confirmTokenExpire;
        await user.save();
        const confirmLink = `http://localhost:5173/confirm-email?token=${confirmToken}`;
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS,
                },
            });
            await transporter.sendMail({
                from: `Suporte <${process.env.USER}>`,
                to: `${user.email}`,
                subject: 'Confirmação de cadastro',
                html: `<p>Para confirmar seu cadastro, clique no link abaixo: </p>
        <a href="${confirmLink}">${confirmLink}</a>
        <p>Este link expira em 1 hora.</p>
        `,
            });
        }
        catch (emailError) {
            console.log('Erro ao enviar email de confirmação:', emailError);
            await User.deleteOne({ _id: user._id });
            res.status(500).json({
                msg: 'Não foi possível enviar o email de confirmação. Tente se registrar novamente.',
            });
            return;
        }
        res.status(200).json({
            message: 'Por favor, confirme seu email para fazer login.',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: `Aconteceu um erro no servidor, tente novamente mais tarde.${error}`,
        });
    }
});
app.get('/auth/confirm-email', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        res.status(400).json({ message: 'Token de confirmação não fornecido' });
        return;
    }
    try {
        console.log('Token recebido:', token);
        console.log('Tipo do token:', typeof token);
        // Debug: buscar apenas pelo token, sem verificar expiração
        const userByToken = await User.findOne({ confirmToken: token });
        console.log('Usuário encontrado pelo token (sem checar expiração):', userByToken ? userByToken.email : 'NÃO ENCONTRADO');
        if (userByToken) {
            console.log('Token no DB:', userByToken.confirmToken);
            console.log('Expiração do token:', userByToken.confirmTokenExpire);
            console.log('Agora:', new Date(Date.now()));
        }
        const user = await User.findOne({
            confirmToken: token,
            confirmTokenExpire: { $gt: Date.now() },
        });
        if (!user) {
            res.status(400).json({ message: 'Token de confirmação inválido ou expirado' });
            return;
        }
        user.active = true;
        user.confirmToken = undefined;
        user.confirmTokenExpire = undefined;
        await user.save();
        res.status(200).json({ message: 'Email confirmado com sucesso! Você já pode fazer login.' });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro ao confirmar email' });
        return;
    }
});
// Login
app.post('/auth/login', async (req, res) => {
    const { senha, email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Insira seu email' });
        return;
    }
    if (!senha) {
        res.status(400).json({ message: 'Insira sua senha' });
        return;
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        res.status(400).json({ message: 'Esse email não existe' });
        return;
    }
    if (!user.active) {
        res.status(403).json({ message: 'Confirme seu email antes de fazer login.' });
        return;
    }
    const senhaCompare = await bcrypt.compare(senha, user.senha);
    if (!senhaCompare) {
        res.status(400).json({ message: 'Senha inválida' });
        return;
    }
    if (email !== user.email) {
        res.status(400).json({ message: 'Não existe usuário cadastrado com esse email' });
        return;
    }
    try {
        const token = jwt.sign({ id: user.email, name: user.nome }, process.env.SECRET, { expiresIn: '1h' });
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log('[DEBUG login] decoded.id:', decoded.id, 'ADMIN_EMAIL:', process.env.ADMIN_EMAIL, 'Match:', decoded.id === process.env.ADMIN_EMAIL);
        if (decoded.id === process.env.ADMIN_EMAIL) {
            console.log('[DEBUG login] Sending redirect: /logadoBarbeiro');
            res.status(200).json({
                message: 'Autenticado com sucesso',
                token: token,
                redirect: '/logadoBarbeiro',
                decoded,
            });
            return;
        }
        res.status(200).json({
            message: 'Autenticado com sucesso',
            token: token,
            redirect: '/logado',
            decoded,
        });
    }
    catch (err) {
        console.log(err);
        res.status(404).json({ message: err });
    }
});
// Reset password
app.post('/resetPassword', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(400).json({ message: 'Email não cadastrado!' });
            return;
        }
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpire = new Date(Date.now() + 3600000);
        user.resetToken = resetToken;
        user.resetTokenExpire = resetTokenExpire;
        await user.save();
        const resetLink = `http://localhost:5173/forgotPass?token=${resetToken}`;
        await transporter.sendMail({
            from: `Suporte <${process.env.USER}>`,
            to: `${user.email}`,
            subject: 'Redefinição de senha',
            html: `<p>Para redefinir sua senha, clique no link abaixo: </p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este link expira em 1 hora.</p>
      `,
        });
        res.status(200).json({ message: 'Email enviado com sucesso' });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Falha ao enviar email do servidor' });
    }
});
// Change password
app.post('/changePass', async (req, res) => {
    const { senha, confirmarsenha, token } = req.body;
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
        res.status(400).json({
            msg: 'Token inválido ou expirado, gere um novo link',
            isAuthenticated: false,
        });
        return;
    }
    const compare = await bcrypt.compare(senha, user.senha);
    if (compare) {
        res.status(400).json({ msg: 'A senha que você digitou é igual a anterior!' });
        return;
    }
    if (senha.length < 10) {
        res.status(422).json({ msg: 'A senha deve conter no mínimo 10 caracteres' });
        return;
    }
    if (!/[!@#$%&*]/.test(senha)) {
        res.status(422).json({ msg: 'A senha deve conter um caractere especial' });
        return;
    }
    if (senha !== confirmarsenha) {
        res.status(400).json({ msg: 'As senhas não condicem' });
        return;
    }
    try {
        const salt = await bcrypt.genSalt(12);
        user.senha = await bcrypt.hash(senha, salt);
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();
        res.status(200).json({ msg: 'Senha redefinida com sucesso!' });
    }
    catch (err) {
        res.status(500).json({ msg: 'Erro ao redefinir senha' });
    }
});
// Connect to MongoDB and start server
mongoose.connect('mongodb://0.0.0.0/BarbeariaReact')
    .then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
    console.log('Conectou ao banco');
})
    .catch((err) => {
    console.log('Erro ao conectar ao banco:', err);
});
export default app;
//# sourceMappingURL=index.js.map