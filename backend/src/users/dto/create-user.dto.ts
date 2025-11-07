import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

enum UserRole {
  CLIENTE = 'CLIENTE',
  PROFISSIONAL = 'PROFISSIONAL',
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  nome: string;

  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  email: string;

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;

  @IsEnum(UserRole, { message: 'O papel deve ser CLIENTE ou PROFISSIONAL.' })
  role: string;
}