import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  cliente_id: string;

  @IsUUID()
  @IsNotEmpty()
  profissional_id: string;

  @IsUUID()
  @IsNotEmpty()
  servico_id: string;

  @IsDateString()
  @IsNotEmpty()
  data_hora_inicio: string;

  @IsDateString()
  @IsNotEmpty()
  data_hora_fim: string;
}