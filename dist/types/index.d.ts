import { Request } from 'express';
import { Document } from 'mongoose';
export interface IUser {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    confirmarsenha?: string;
    resetToken?: string;
    resetTokenExpire?: Date;
    confirmToken?: string;
    confirmTokenExpire?: Date;
    active?: boolean;
}
export interface IUserDocument extends IUser, Document {
}
export interface IJwtPayload {
    id: string;
    name: string;
    iat?: number;
    exp?: number;
}
export interface AuthenticatedRequest extends Request {
    user?: IJwtPayload;
}
export interface IAgendado {
    dia: string;
    nome: string;
    servico: string;
    horario: string;
    termino?: string;
    tempo: string;
    status: string;
    horarios: string[];
    horariosMinutos: number[];
    createdAt: Date;
    isArchived: boolean;
}
export interface IAgendadoDocument extends IAgendado, Document {
}
export interface IHorarios {
    diasemana: string;
    inicio: number;
    fim: number;
    intervalo: number;
    arraydehorarios?: number[];
    disponiveis?: number[];
}
export interface IHorariosDocument extends IHorarios, Document {
}
export interface IDailyAvailability {
    date: Date;
    diasemana: string;
    availableSlots: number[];
    occupiedSlots: number[];
}
export interface IDailyAvailabilityDocument extends IDailyAvailability, Document {
}
export interface IServico {
    titulo: string;
    descricao: string;
    duracao: number;
    preco: number;
}
export interface IServicoDocument extends IServico, Document {
}
export interface ScheduleRequestBody {
    tempo: number;
    value: number;
    servico: string;
    hora: number;
    diaSemana: string;
    date: Date;
}
export interface LoginRequestBody {
    email: string;
    senha: string;
}
export interface RegisterRequestBody {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    confirmarsenha: string;
}
export interface DefinirHorarioRequestBody {
    inicio: string;
    fim: string;
    intervalo: string;
    diaSemana: string;
}
export interface ResetPasswordRequestBody {
    email: string;
}
export interface ChangePasswordRequestBody {
    senha: string;
    confirmarsenha: string;
    token: string;
}
export interface ApiResponse<T = unknown> {
    message?: string;
    msg?: string;
    data?: T;
}
export interface AuthResponse {
    message: string;
    token: string;
    redirect: string;
    decoded: IJwtPayload;
}
//# sourceMappingURL=index.d.ts.map