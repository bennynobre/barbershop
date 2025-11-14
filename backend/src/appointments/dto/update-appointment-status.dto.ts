import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus, {
    message: `O status deve ser PENDENTE, CONFIRMADO ou CANCELADO`,
  })
  @IsNotEmpty()
  status: AppointmentStatus;
}