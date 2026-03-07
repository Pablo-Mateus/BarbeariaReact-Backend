import { AppointmentRepository } from './appointment.repository.js';
import { ScheduleRepository } from '../schedule/schedule.repository.js';
import { IAppointmentDocument } from './appointment.model.js';
import { CreateAppointmentInput, DayAvailabilityInput } from './appointment.validation.js';
import { IJwtPayload } from '../../shared/types/index.js';
export declare class AppointmentService {
    private readonly appointmentRepository;
    private readonly scheduleRepository;
    constructor(appointmentRepository: AppointmentRepository, scheduleRepository: ScheduleRepository);
    /**
     * Create a new appointment.
     * Preserves the EXACT business logic from the original index.ts:
     * - Calculates time slots from start time + service duration
     * - Validates required fields (tempo, servico)
     * - Creates appointment record
     * - Removes occupied slots from available slots ($pull)
     */
    createAppointment(tenantId: string, user: IJwtPayload, data: CreateAppointmentInput): Promise<{
        message: string;
    }>;
    /**
     * Cancel an appointment.
     * Preserves original logic:
     * - Finds appointment by ID
     * - Restores cancelled slots back to schedule ($push + $sort)
     * - Updates status to 'Cancelado pelo usuário'
     */
    cancelAppointment(tenantId: string, agendamentoId: string): Promise<{
        message: string;
    }>;
    /**
     * Confirm an appointment (owner/barber only).
     * Preserves original logic: sets status to 'Aceito'.
     */
    confirmAppointment(tenantId: string, agendamentoId: string): Promise<{
        message: string;
    }>;
    /**
     * Archive cancelled schedules for a client.
     */
    archiveCancelled(tenantId: string, clientName: string): Promise<{
        message: string;
    }>;
    /**
     * Delete cancelled schedules (owner only).
     */
    deleteCancelled(tenantId: string): Promise<{
        message: string;
    }>;
    /**
     * Get schedules for a user.
     * Preserves original logic:
     * - Admin/owner sees ALL appointments
     * - Client sees only their own
     */
    getSchedules(tenantId: string, user: IJwtPayload): Promise<{
        usuario: IAppointmentDocument[];
    }>;
    /**
     * Get day availability.
     * Preserves EXACT original logic:
     * - If there's an appointment with 'Aguardando aceite' for the date,
     *   calculates available slots minus occupied
     * - Otherwise returns all template slots
     */
    getDayAvailability(tenantId: string, data: DayAvailabilityInput): Promise<{
        horarios: number[];
    }>;
}
//# sourceMappingURL=appointment.service.d.ts.map