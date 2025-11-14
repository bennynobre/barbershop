import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Between, Repository } from 'typeorm'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { Appointment } from './entities/appointment.entity'; 
import { AppointmentStatus } from './entities/appointment.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AppointmentsService {
  
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const newAppointment = this.appointmentRepository.create(createAppointmentDto);
    const savedAppointment = await this.appointmentRepository.save(newAppointment);

    const fullAppointment = await this.findOne(savedAppointment.id);
    
    const msg = `Novo agendamento: ${fullAppointment.servico.nome} com ${fullAppointment.cliente.nome} para ${new Date(fullAppointment.data_hora_inicio).toLocaleDateString()}.`;
    
    await this.notificationsService.create(fullAppointment.profissional_id, msg);

    return savedAppointment;
  }

  findAll() {
    return this.appointmentRepository.find({
      relations: ['cliente', 'profissional', 'servico'],
    });
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['cliente', 'profissional', 'servico'],
    });

    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado.`);
    }
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentRepository.preload({
      id: id,
      ...updateAppointmentDto,
    });
    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado.`);
    }
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: string) {
    const result = await this.appointmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado.`);
    }
    return { deleted: true };
  }

  async findByProfessionalAndDate(
    profissional_id: string, 
    start: Date, 
    end: Date
  ): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: {
        profissional_id: profissional_id,
        data_hora_inicio: Between(start, end),
      },
      relations: ['cliente', 'servico'], 
      order: {
        data_hora_inicio: 'ASC' 
      }
    });
  }

  async findByClientId(cliente_id: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: {
        cliente_id: cliente_id, 
      },
      relations: ['profissional', 'servico'],
      order: {
        data_hora_inicio: 'ASC', 
      },
    });
  }

  async updateStatus(id: string, newStatus: AppointmentStatus, motivo_cancelamento?: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['cliente', 'servico', 'profissional'] 
    });

    if (!appointment) throw new NotFoundException('Agendamento não encontrado.');

    appointment.status = newStatus;
    if (newStatus === AppointmentStatus.CANCELADO && motivo_cancelamento) {
      appointment.motivo_cancelamento = motivo_cancelamento;
    }
    if (newStatus === AppointmentStatus.CONFIRMADO) {
      appointment.motivo_cancelamento = null;
    }

    const savedAppointment = await this.appointmentRepository.save(appointment);

    let msg = '';
    if (newStatus === AppointmentStatus.CONFIRMADO) {
      msg = `Seu agendamento de ${appointment.servico.nome} foi CONFIRMADO pelo barbeiro ${appointment.profissional.nome}!`;
    } else if (newStatus === AppointmentStatus.CANCELADO) {
      msg = `Seu agendamento foi CANCELADO. Motivo: ${motivo_cancelamento || 'Não informado'}.`;
    }

    if (msg) {
      await this.notificationsService.create(appointment.cliente_id, msg);
    }

    return savedAppointment;
  }
}