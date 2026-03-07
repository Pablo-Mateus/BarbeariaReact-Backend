import { Model, Document, Types } from 'mongoose';
import { AppointmentStatus } from '../../shared/types/index.js';
export interface IAppointment {
    tenantId: Types.ObjectId;
    clientId: Types.ObjectId;
    barberId?: Types.ObjectId;
    dia: string;
    nome: string;
    servico: string;
    horario: string;
    termino?: string;
    tempo: string;
    status: AppointmentStatus;
    horarios: string[];
    horariosMinutos: number[];
    createdAt: Date;
    isArchived: boolean;
}
export interface IAppointmentDocument extends IAppointment, Document {
}
declare const Appointment: Model<IAppointmentDocument>;
export default Appointment;
//# sourceMappingURL=appointment.model.d.ts.map