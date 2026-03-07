import { ScheduleRepository } from './schedule.repository.js';
import { DefineScheduleInput, GetTimesInput } from './schedule.validation.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/app-error.js';

export class ScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  /**
   * Define working hours for a day of the week.
   * Preserves EXACT original logic from index.ts /DefinirHorario:
   * - Parses HH:MM format to minutes
   * - Validates start < end
   * - Generates slot array from start to end with interval
   * - Upserts (creates or updates) the schedule
   */
  async defineSchedule(
    tenantId: string,
    data: DefineScheduleInput
  ): Promise<{ message: string }> {
    const { inicio, fim, intervalo: intervaloStr, diaSemana } = data;

    const inicioMinutos = +inicio.split(':')[0] * 60 + +inicio.split(':')[1];
    const fimMinutos = +fim.split(':')[0] * 60 + +fim.split(':')[1];
    const intervalo = +intervaloStr;

    if (inicioMinutos > fimMinutos) {
      throw new BadRequestError('Inicio do expediente maior que o encerramento!');
    }

    let minutosTotais: number;
    if (fimMinutos > inicioMinutos) {
      minutosTotais = fimMinutos - inicioMinutos;
    } else {
      minutosTotais = 1440 - inicioMinutos + fimMinutos;
    }

    const slotsHorario: number[] = [];
    for (
      let minutoAtual = inicioMinutos;
      minutoAtual <= inicioMinutos + minutosTotais;
      minutoAtual += intervalo
    ) {
      const minutoAtualDia = minutoAtual % 1440;
      slotsHorario.push(minutoAtualDia);
    }

    await this.scheduleRepository.upsertSchedule(tenantId, diaSemana, {
      inicio: inicioMinutos,
      fim: fimMinutos,
      intervalo,
      arraydehorarios: slotsHorario,
      disponiveis: slotsHorario,
    });

    return { message: 'Horários atualizados com sucesso!' };
  }

  /**
   * Get working hours for a day of the week.
   * Preserves original /getTimes logic.
   */
  async getTimes(
    tenantId: string,
    data: GetTimesInput
  ): Promise<{ inicio: string; fim: string; intervalo: number }> {
    const availableTime = await this.scheduleRepository.findByDiaSemana(tenantId, data.dia);
    if (!availableTime) {
      throw new NotFoundError('Não existem horários para a data selecionada!');
    }

    const startTime = `${Math.floor(availableTime.inicio / 60).toString().padStart(2, '0')}:${(availableTime.inicio % 60)
      .toString()
      .padStart(2, '0')}`;
    const lastTime = `${Math.floor(availableTime.fim / 60).toString().padStart(2, '0')}:${(availableTime.fim % 60)
      .toString()
      .padStart(2, '0')}`;

    return {
      inicio: startTime,
      fim: lastTime,
      intervalo: availableTime.intervalo,
    };
  }
}
