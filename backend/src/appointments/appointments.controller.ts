import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly apptService: AppointmentsService) {}

  @Get()
  findAll(): Promise<Appointment[]> {
    return this.apptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Appointment | null> {
    return this.apptService.findOne(+id);
  }

  @Post()
  create(@Body() payload: { patientName: string; date: string; time: string; doctorId: number; }) {
    return this.apptService.create(payload);
  }

  // update/reschedule
  @Put(':id')
  update(@Param('id') id: string, @Body() payload: Partial<Appointment> & { doctorId?: number }) {
    return this.apptService.update(+id, payload);
  }

  // optional: quick status update
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.apptService.update(+id, { status: body.status as any });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apptService.remove(+id);
  }

  // cancel route (optional convenience)
  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.apptService.cancel(+id);
  }

  @UseGuards(JwtAuthGuard)
@Get('queue')
getQueue() {
  return this.apptService.getQueue();
}

@UseGuards(JwtAuthGuard)
@Patch('queue/:id/status')
updateQueueStatus(
  @Param('id') id: number,
  @Body('status') status: AppointmentStatus,
) {
  return this.apptService.updateStatus(id, status);
}

@UseGuards(JwtAuthGuard)
@Get('history')
getHistory() {
  return this.apptService.getHistory();
}

}
