import Appointment, { IAppointmentDocument } from './appointment.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
import { FilterQuery } from 'mongoose';

export class AppointmentRepository extends BaseRepository<IAppointmentDocument> {
  constructor() {
    super(Appointment);
  }

  async findByClient(tenantId: string, clientName: string): Promise<IAppointmentDocument[]> {
    return this.findAll(tenantId, { nome: clientName } as FilterQuery<IAppointmentDocument>);
  }

  async findByClientNotArchived(tenantId: string, clientName: string): Promise<IAppointmentDocument[]> {
    return this.findAll(tenantId, {
      nome: clientName,
      isArchived: { $ne: true },
    } as FilterQuery<IAppointmentDocument>);
  }

  async findAllNotArchived(tenantId: string): Promise<IAppointmentDocument[]> {
    return this.findAll(tenantId, {
      isArchived: { $ne: true },
    } as FilterQuery<IAppointmentDocument>);
  }

  async archiveCancelledByUser(tenantId: string, clientName: string): Promise<number> {
    return this.updateMany(
      tenantId,
      { nome: clientName, status: 'Cancelado pelo usuário' } as FilterQuery<IAppointmentDocument>,
      { $set: { isArchived: true } }
    );
  }

  async deleteCancelled(tenantId: string): Promise<number> {
    return this.deleteMany(
      tenantId,
      { status: 'Cancelado pelo usuário' } as FilterQuery<IAppointmentDocument>
    );
  }

  async findByDateAndStatus(tenantId: string, date: string, status: string): Promise<IAppointmentDocument | null> {
    return this.findOne(tenantId, {
      createdAt: date,
      status,
    } as FilterQuery<IAppointmentDocument>);
  }

  async findByDateRange(tenantId: string, start: Date, end: Date): Promise<IAppointmentDocument[]> {
    return this.findAll(tenantId, {
      createdAt: { $gte: start, $lte: end },
    } as FilterQuery<IAppointmentDocument>);
  }
}
