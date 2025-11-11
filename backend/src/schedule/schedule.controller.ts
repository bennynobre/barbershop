import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async getAvailableSlots(
    @Query('professionalId') professionalId: string,
    @Query('serviceId') serviceId: string,
    @Query('date') date: string, 
  ) {
    if (!professionalId || !serviceId || !date) {
      throw new BadRequestException('Parâmetros incompletos (professionalId, serviceId, date)');
    }

    return this.scheduleService.getAvailableSlots(
      date,
      professionalId,
      serviceId,
    );
  }
}