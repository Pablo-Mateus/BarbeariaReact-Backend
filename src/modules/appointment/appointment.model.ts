import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { AppointmentStatus } from '../../shared/types/index.js';

export interface IAppointment {
  tenantId: Types.ObjectId;
  clientId: Types.ObjectId;
  barberId?: Types.ObjectId;
  dia: string;
  nome: string; // Preserved for backwards compatibility
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

export interface IAppointmentDocument extends IAppointment, Document {}

const appointmentSchema = new Schema<IAppointmentDocument>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    barberId: { type: Schema.Types.ObjectId, ref: 'User' },
    dia: { type: String, required: true },
    nome: { type: String, required: true },
    servico: { type: String, required: true },
    horario: { type: String, required: true },
    termino: { type: String },
    tempo: { type: String, required: true },
    status: {
      type: String,
      enum: ['Aguardando aceite', 'Aceito', 'Cancelado pelo usuário', 'Concluído'],
      required: true,
    },
    horarios: { type: [String], default: [] },
    horariosMinutos: { type: [Number], default: [] },
    createdAt: { type: Date, default: Date.now },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
appointmentSchema.index({ tenantId: 1, createdAt: -1 });
appointmentSchema.index({ tenantId: 1, status: 1 });
appointmentSchema.index({ tenantId: 1, clientId: 1 });
appointmentSchema.index({ tenantId: 1, dia: 1 });
appointmentSchema.index({ tenantId: 1, nome: 1, status: 1 });

const Appointment: Model<IAppointmentDocument> = mongoose.model<IAppointmentDocument>(
  'Appointment',
  appointmentSchema
);

export default Appointment;
