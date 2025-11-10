import { 
  IsNotEmpty, 
  IsNumber, 
  IsPositive, 
  IsString, 
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nome: string;

  @IsNumber()
  @IsPositive({ message: 'A duração deve ser um número positivo.' })
  duracao_minutos: number;

  @IsNumber()
  @IsPositive({ message: 'O preço deve ser um número positivo.' })
  preco: number;
}