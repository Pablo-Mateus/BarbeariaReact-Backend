import { BadRequestError, NotFoundError, } from '../../shared/errors/app-error.js';
export class AppointmentService {
    appointmentRepository;
    scheduleRepository;
    constructor(appointmentRepository, scheduleRepository) {
        this.appointmentRepository = appointmentRepository;
        this.scheduleRepository = scheduleRepository;
    }
    /**
     * Create a new appointment.
     * Preserves the EXACT business logic from the original index.ts:
     * - Calculates time slots from start time + service duration
     * - Validates required fields (tempo, servico)
     * - Creates appointment record
     * - Removes occupied slots from available slots ($pull)
     */
    async createAppointment(tenantId, user, data) {
        const { tempo, servico, hora, diaSemana, date } = data;
        const horario = await this.scheduleRepository.findByDiaSemana(tenantId, diaSemana);
        if (!horario) {
            throw new NotFoundError('Horário não encontrado para o dia selecionado');
        }
        if (!tempo) {
            throw new BadRequestError('Para criar um agendamento é necessário selecionar um horário.');
        }
        if (!servico) {
            throw new BadRequestError('Para criar um agendamento é necessário selecionar um serviço.');
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
        await this.appointmentRepository.create({
            tenantId: horario.tenantId, // Use the ObjectId from the schedule
            clientId: user.userId,
            dia: diaSemana,
            nome: user.name,
            servico,
            horario: tempo.toString(),
            tempo: hora.toString(),
            status: 'Aguardando aceite',
            horarios: arrayFormat,
            horariosMinutos: arrayMinutos,
            createdAt: new Date(date),
        });
        // Remove occupied slots from available
        await this.scheduleRepository.removeSlots(tenantId, diaSemana, arrayMinutos);
        return { message: 'Agendamento criado com sucesso!' };
    }
    /**
     * Cancel an appointment.
     * Preserves original logic:
     * - Finds appointment by ID
     * - Restores cancelled slots back to schedule ($push + $sort)
     * - Updates status to 'Cancelado pelo usuário'
     */
    async cancelAppointment(tenantId, agendamentoId) {
        const agendado = await this.appointmentRepository.findById(tenantId, agendamentoId);
        if (!agendado) {
            throw new NotFoundError('Agendamento');
        }
        const horarios = await this.scheduleRepository.findByDiaSemana(tenantId, agendado.dia);
        if (!horarios) {
            throw new NotFoundError('Horários');
        }
        // Restore slots
        await this.scheduleRepository.restoreSlots(tenantId, agendado.dia, agendado.horariosMinutos);
        // Update status
        await this.appointmentRepository.updateById(tenantId, agendamentoId, {
            $set: { status: 'Cancelado pelo usuário' },
        });
        return { message: 'Agendamento cancelado com sucesso' };
    }
    /**
     * Confirm an appointment (owner/barber only).
     * Preserves original logic: sets status to 'Aceito'.
     */
    async confirmAppointment(tenantId, agendamentoId) {
        const result = await this.appointmentRepository.updateById(tenantId, agendamentoId, { $set: { status: 'Aceito' } });
        if (!result) {
            throw new NotFoundError('Agendamento');
        }
        return { message: 'Agendamento aceito!' };
    }
    /**
     * Archive cancelled schedules for a client.
     */
    async archiveCancelled(tenantId, clientName) {
        await this.appointmentRepository.archiveCancelledByUser(tenantId, clientName);
        return { message: 'Arquivamento realizado com sucesso!' };
    }
    /**
     * Delete cancelled schedules (owner only).
     */
    async deleteCancelled(tenantId) {
        await this.appointmentRepository.deleteCancelled(tenantId);
        return { message: 'Agendamentos cancelados com sucesso!' };
    }
    /**
     * Get schedules for a user.
     * Preserves original logic:
     * - Admin/owner sees ALL appointments
     * - Client sees only their own
     */
    async getSchedules(tenantId, user) {
        const isAdmin = user.role === 'owner' || user.role === 'barber';
        if (isAdmin) {
            const agendados = await this.appointmentRepository.findAllNotArchived(tenantId);
            return { usuario: agendados };
        }
        const agendados = await this.appointmentRepository.findByClientNotArchived(tenantId, user.name);
        return { usuario: agendados };
    }
    /**
     * Get day availability.
     * Preserves EXACT original logic:
     * - If there's an appointment with 'Aguardando aceite' for the date,
     *   calculates available slots minus occupied
     * - Otherwise returns all template slots
     */
    async getDayAvailability(tenantId, data) {
        const { dia, date } = data;
        const agendado = await this.appointmentRepository.findByDateAndStatus(tenantId, date, 'Aguardando aceite');
        const template = await this.scheduleRepository.findByDiaSemana(tenantId, dia);
        if (!template) {
            throw new NotFoundError('Template');
        }
        const horainicio = template.inicio;
        const horaFim = template.fim;
        const templateIntervalo = template.intervalo;
        const arraySlots = [];
        for (let i = horainicio; i <= horaFim; i += templateIntervalo) {
            arraySlots.push(i);
        }
        if (agendado) {
            const arrayAgendado = agendado.horariosMinutos;
            const setRemove = new Set(arrayAgendado);
            const arrayResult = arraySlots.filter((item) => !setRemove.has(item));
            return { horarios: arrayResult };
        }
        return { horarios: arraySlots };
    }
}
//# sourceMappingURL=appointment.service.js.map