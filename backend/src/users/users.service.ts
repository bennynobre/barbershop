import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'; 
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const emailExists = await this.usersRepository.findOneBy({ 
      email: createUserDto.email 
    });

    if (emailExists) {
      throw new BadRequestException('Este e-mail já está em uso.');
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);

    const { password, ...result } = savedUser;
    
    return savedUser;
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    const user = this.usersRepository.findOneBy({ id });
    
    if (!user) {
      throw new BadRequestException('Usuário não encontrado.');
    }
    
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email }) 
      .addSelect('user.password') 
      .getOne();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}