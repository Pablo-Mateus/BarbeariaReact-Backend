import { IAppointmentDocument } from './appointment.model.js';
import { BaseRepository } from '../../shared/base/base.repository.js';
export declare class AppointmentRepository extends BaseRepository<IAppointmentDocument> {
    constructor();
    findByClient(tenantId: string, clientName: string): Promise<IAppointmentDocument[]>;
    findByClientNotArchived(tenantId: string, clientName: string): Promise<IAppointmentDocument[]>;
    findAllNotArchived(tenantId: string): Promise<IAppointmentDocument[]>;
    archiveCancelledByUser(tenantId: string, clientName: string): Promise<number>;
    deleteCancelled(tenantId: string): Promise<number>;
    findByDateAndStatus(tenantId: string, date: string, status: string): Promise<IAppointmentDocument | null>;
}
//# sourceMappingURL=appointment.repository.d.ts.map