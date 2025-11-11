import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { AvailabilityModule } from 'src/availability/availability.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [
    AvailabilityModule,
    AppointmentsModule,
    ServicesModule
  ],
  providers: [ScheduleService],
  controllers: [ScheduleController]
})
export class ScheduleModule {}