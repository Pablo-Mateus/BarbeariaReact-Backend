import fs from 'fs';
import path from 'path';
import { AppointmentRepository } from './appointment.repository.js';

const logFile = path.resolve(process.cwd(), 'debug.log');
function logToFile(msg: string) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
}
import { ScheduleRepository } from '../schedule/schedule.repository.js';
import { IAppointmentDocument } from './appointment.model.js';
import { CreateAppointmentInput, DayAvailabilityInput } from './appointment.validation.js';
import { IJwtPayload } from '../../shared/types/index.js';
import {
  BadRequestError,
  NotFoundError,
} from '../../shared/errors/app-error.js';

export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly scheduleRepository: ScheduleRepository
  ) {}

  /**
   * Create a new appointment.
   * Preserves the EXACT business logic from the original index.ts:
   * - Calculates time slots from start time + service duration
   * - Validates required fields (tempo, servico)
   * - Creates appointment record
   * - Removes occupied slots from available slots ($pull)
   */
  async createAppointment(
    tenantId: string,
    user: IJwtPayload,
    data: CreateAppointmentInput
  ): Promise<{ message: string }> {
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

    const arrayFormat: string[] = [];
    const arrayMinutos: number[] = [];
    for (let i = tempo; i <= minutoServico; i += horario.intervalo) {
      arrayMinutos.push(i);
      const horaFormat = Math.floor(i / 60).toString();
      const minutoFormat = (i % 60).toString().padStart(2, '0');
      arrayFormat.push(`${horaFormat}:${minutoFormat}`);
    }

    await this.appointmentRepository.create({
      tenantId: horario.tenantId, // Use the ObjectId from the schedule
      clientId: user.userId as unknown as import('mongoose').Types.ObjectId,
      dia: diaSemana,
      nome: user.name,
      servico,
      horario: tempo.toString(),
      tempo: hora.toString(),
      status: 'Aguardando aceite',
      horarios: arrayFormat,
      horariosMinutos: arrayMinutos,
      createdAt: new Date(date),
    } as Partial<IAppointmentDocument>);

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
  async cancelAppointment(
    tenantId: string,
    agendamentoId: string
  ): Promise<{ message: string }> {
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
  async confirmAppointment(
    tenantId: string,
    agendamentoId: string
  ): Promise<{ message: string }> {
    const result = await this.appointmentRepository.updateById(
      tenantId,
      agendamentoId,
      { $set: { status: 'Aceito' } }
    );
    if (!result) {
      throw new NotFoundError('Agendamento');
    }
    return { message: 'Agendamento aceito!' };
  }

  /**
   * Archive cancelled schedules for a client.
   */
  async archiveCancelled(
    tenantId: string,
    clientName: string
  ): Promise<{ message: string }> {
    await this.appointmentRepository.archiveCancelledByUser(tenantId, clientName);
    return { message: 'Arquivamento realizado com sucesso!' };
  }

  /**
   * Delete cancelled schedules (owner only).
   */
  async deleteCancelled(tenantId: string): Promise<{ message: string }> {
    await this.appointmentRepository.deleteCancelled(tenantId);
    return { message: 'Agendamentos cancelados com sucesso!' };
  }

  /**
   * Get schedules for a user.
   * Preserves original logic:
   * - Admin/owner sees ALL appointments
   * - Client sees only their own
   */
  async getSchedules(
    tenantId: string,
    user: IJwtPayload
  ): Promise<{ usuario: IAppointmentDocument[] }> {
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
  async getDayAvailability(
    tenantId: string,
    data: DayAvailabilityInput
  ): Promise<{ horarios: number[] }> {
    const { dia, date } = data;
    const infoMsg = `[AVAILABILITY] Tenant: ${tenantId}, Dia: ${dia}, Date: ${date}\n`;
    fs.appendFileSync(path.resolve(process.cwd(), 'request.log'), infoMsg);

    // Fix: Query all appointments for the day, not just one.
    // Also include 'Aceito' status, as confirmed appointments should block slots too.
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    
    const appointments = await this.appointmentRepository.findByDateRange(tenantId, start, end);
    const busyAppointments = appointments.filter(a => 
      a.status === 'Aguardando aceite' || a.status === 'Aceito'
    );

    const template = await this.scheduleRepository.findByDiaSemana(tenantId, dia);
    
    if (!template) {
      logToFile(`[getDayAvailability] Template não encontrado para o dia ${dia} (tenant: ${tenantId})`);
      return { horarios: [] };
    }

    const horainicio = template.inicio;
    const horaFim = template.fim;
    const templateIntervalo = template.intervalo;

    // Handle overnight shifts like in defineSchedule
    let totalMinutes: number;
    if (horaFim > horainicio) {
      totalMinutes = horaFim - horainicio;
    } else {
      totalMinutes = 1440 - horainicio + horaFim;
    }

    const arraySlots: number[] = [];
    for (let i = 0; i <= totalMinutes; i += templateIntervalo) {
      arraySlots.push((horainicio + i) % 1440);
    }

    if (busyAppointments.length > 0) {
      const busySlots = new Set<number>();
      busyAppointments.forEach(app => {
        app.horariosMinutos.forEach(slot => busySlots.add(slot));
      });
      
      const arrayResult = arraySlots.filter((item) => !busySlots.has(item));
      logToFile(`[getDayAvailability] Retornando ${arrayResult.length} horários (com ${busyAppointments.length} agendamentos)`);
      return { horarios: arrayResult };
    }

    logToFile(`[getDayAvailability] Retornando ${arraySlots.length} horários (vazio de agendamentos)`);
    return { horarios: arraySlots };
  }
}
