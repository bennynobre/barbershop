import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService,   
  ) {}

  async validateUser(email: string, pass: string): Promise<UserWithoutPassword | null> {
    
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    if (isPasswordMatching) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserWithoutPassword) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role, 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}