import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { UsersModule } from 'src/users/users.module'; 
import { ServicesModule } from 'src/services/services.module'; 
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]), 
    UsersModule,    
    ServicesModule,
    NotificationsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService], 
})
export class AppointmentsModule {}