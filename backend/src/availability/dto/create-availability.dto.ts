import { 
  IsInt, 
  IsMilitaryTime, 
  IsNotEmpty, 
  IsUUID, 
  Max, 
  Min 
} from 'class-validator';

export class CreateAvailabilityDto {
  @IsUUID()
  @IsNotEmpty()
  profissional_id: string;

  @IsInt()
  @Min(0) 
  @Max(6) 
  dia_da_semana: number;

  @IsMilitaryTime({ message: 'A hora de início deve estar no formato HH:MM' })
  hora_inicio: string;

  @IsMilitaryTime({ message: 'A hora de fim deve estar no formato HH:MM' })
  hora_fim: string;
}