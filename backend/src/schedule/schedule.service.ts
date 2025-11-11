import { Injectable } from '@nestjs/common';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { AvailabilityService } from 'src/availability/availability.service';
import { ServicesService } from 'src/services/services.service';
import { 
  parseISO, 
  getDay, 
  parse, 
  isSameHour, 
  isSameMinute, 
  addMinutes, 
  isBefore,
  isAfter,
  startOfDay,
  endOfDay
} from 'date-fns';

@Injectable()
export class ScheduleService {
  constructor(
    private availabilityService: AvailabilityService,
    private appointmentsService: AppointmentsService,
    private servicesService: ServicesService,
  ) {}

  async getAvailableSlots(
    dateStr: string,        
    professionalId: string, 
    serviceId: string,      
  ): Promise<string[]> {
    
    const service = await this.servicesService.findOne(serviceId);
    if (!service) return []; 
    const duracaoServico = service.duracao_minutos;

    const data = parseISO(dateStr);
    const diaDaSemana = getDay(data); 

    const availability = await this.availabilityService.findByProfessional(professionalId);
    const workSchedule = availability.find(a => a.dia_da_semana === diaDaSemana && a.ativo);

    if (!workSchedule) {
      return []; 
    }

    const appointments = await this.appointmentsService.findByProfessionalAndDate(
      professionalId,
      startOfDay(data),
      endOfDay(data)
    );

    const horaInicio = parse(workSchedule.hora_inicio, 'HH:mm:ss', data);
    const horaFim = parse(workSchedule.hora_fim, 'HH:mm:ss', data);

    const slots: string[] = [];
    let slotAtual = horaInicio;

    while (isBefore(slotAtual, horaFim)) {
      const slotFormatado = `${String(slotAtual.getHours()).padStart(2, '0')}:${String(slotAtual.getMinutes()).padStart(2, '0')}`;
      
      const isBooked = appointments.some(app => 
        isSameHour(app.data_hora_inicio, slotAtual) &&
        isSameMinute(app.data_hora_inicio, slotAtual)
      );

      const isPast = isBefore(slotAtual, new Date()); 

      if (!isBooked && !isPast) {
        slots.push(slotFormatado);
      }

      slotAtual = addMinutes(slotAtual, duracaoServico);
    }

    return slots;
  }
}