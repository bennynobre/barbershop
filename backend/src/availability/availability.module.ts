import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './entities/availability.entity';
import { UsersModule } from 'src/users/users.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Availability]), 
    UsersModule,
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService], 
})
export class AvailabilityModule {}