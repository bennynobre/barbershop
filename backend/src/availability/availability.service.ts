import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Availability } from './entities/availability.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) {}

  create(createAvailabilityDto: CreateAvailabilityDto) {
    const newAvailability = this.availabilityRepository.create(createAvailabilityDto);
    return this.availabilityRepository.save(newAvailability);
  }

  findAll() {
    return `This action returns all availability (use findByProfessional)`;
  }

  findByProfessional(profissional_id: string) {
    return this.availabilityRepository.find({
      where: { profissional_id },
      order: { dia_da_semana: 'ASC' },
    });
  }

  findOne(id: string) {
    const availability = this.availabilityRepository.findOneBy({ id });
    if (!availability) {
      throw new NotFoundException(`Disponibilidade com ID ${id} não encontrada.`);
    }
    return availability;
  }

  async update(id: string, updateAvailabilityDto: UpdateAvailabilityDto) {
    const availability = await this.availabilityRepository.preload({
      id: id,
      ...updateAvailabilityDto,
    });
    if (!availability) {
      throw new NotFoundException(`Disponibilidade com ID ${id} não encontrada.`);
    }
    return this.availabilityRepository.save(availability);
  }

  async remove(id: string) {
    const result = await this.availabilityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Disponibilidade com ID ${id} não encontrada.`);
    }
    return { deleted: true };
  }
}