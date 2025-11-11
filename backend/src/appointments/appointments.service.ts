import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Between, Repository } from 'typeorm'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { Appointment } from './entities/appointment.entity'; 

@Injectable()
export class AppointmentsService {
  
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  create(createAppointmentDto: CreateAppointmentDto) {
    const newAppointment = this.appointmentRepository.create(createAppointmentDto);
    return this.appointmentRepository.save(newAppointment);
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
    });
  }
}