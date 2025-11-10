import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const newService = this.serviceRepository.create(createServiceDto);
    return this.serviceRepository.save(newService);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado.`);
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.preload({
      id: id,
      ...updateServiceDto,
    });
    
    if (!service) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado.`);
    }
    
    return this.serviceRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado.`);
    }
  }
}