import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin', 
      password: 'mysecretpassword', 
      database: 'barbeariaDB', 
      
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      
      synchronize: true, 
    }),
    UsersModule,
    AuthModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}