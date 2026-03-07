import Appointment from './appointment.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
export class AppointmentRepository extends BaseRepository {
    constructor() {
        super(Appointment);
    }
    async findByClient(tenantId, clientName) {
        return this.findAll(tenantId, { nome: clientName });
    }
    async findByClientNotArchived(tenantId, clientName) {
        return this.findAll(tenantId, {
            nome: clientName,
            isArchived: { $ne: true },
        });
    }
    async findAllNotArchived(tenantId) {
        return this.findAll(tenantId, {
            isArchived: { $ne: true },
        });
    }
    async archiveCancelledByUser(tenantId, clientName) {
        return this.updateMany(tenantId, { nome: clientName, status: 'Cancelado pelo usuário' }, { $set: { isArchived: true } });
    }
    async deleteCancelled(tenantId) {
        return this.deleteMany(tenantId, { status: 'Cancelado pelo usuário' });
    }
    async findByDateAndStatus(tenantId, date, status) {
        return this.findOne(tenantId, {
            createdAt: date,
            status,
        });
    }
}
//# sourceMappingURL=appointment.repository.js.map