import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request , Query} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get('me')
  findMyClientAppointments(@Request() req) {
    const clientId = req.user.id; 
    return this.appointmentsService.findByClientId(clientId);
  }

  @Get('professional/me') 
  async findMyProfessionalSchedule(
    @Request() req,
    @Query('date') dateStr: string, 
  ) {
    const professionalId = req.user.id;

    const data = parseISO(dateStr);
    const inicioDoDia = startOfDay(data);
    const fimDoDia = endOfDay(data);

    return this.appointmentsService.findByProfessionalAndDate(
      professionalId,
      inicioDoDia,
      fimDoDia,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateStatus(id, updateStatusDto.status);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}