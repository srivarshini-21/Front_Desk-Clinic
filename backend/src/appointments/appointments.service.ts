import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { Doctor } from '../doctors/doctor.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) {}

  // Create new appointment
  async create(data: { patientName: string; doctorId: number; date: string; time: string }) {
    const doctor = await this.doctorRepo.findOne({ where: { id: data.doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const appointment = this.appointmentRepo.create({
      patientName: data.patientName,
      doctor,
      date: data.date,
      time: data.time,
      status: AppointmentStatus.BOOKED
    });

    return this.appointmentRepo.save(appointment);
  }

  // Get all appointments
  async findAll() {
    return this.appointmentRepo.find({ relations: ['doctor'] });
  }

  // Get single appointment
  async findOne(id: number) {
  if (!id || isNaN(id)) {
    throw new NotFoundException('Invalid appointment ID');
  }
  const appointment = await this.appointmentRepo.findOne({
    where: { id },
    relations: ['doctor']
  });
  if (!appointment) throw new NotFoundException('Appointment not found');
  return appointment;
 }

  // Update appointment details
  async update(id: number, updateData: Partial<Appointment>) {
    const appointment = await this.findOne(id);

    // If doctorId provided, fetch doctor
    if (updateData['doctorId']) {
      const doctor = await this.doctorRepo.findOne({ where: { id: updateData['doctorId'] } });
      if (!doctor) throw new NotFoundException('Doctor not found');
      appointment.doctor = doctor;
    }

    // Update other fields
    if (updateData.patientName !== undefined) appointment.patientName = updateData.patientName;
    if (updateData.date !== undefined) appointment.date = updateData.date;
    if (updateData.time !== undefined) appointment.time = updateData.time;
    if (updateData.status !== undefined) appointment.status = updateData.status as AppointmentStatus;

    return this.appointmentRepo.save(appointment);
  }

  // Update only status
  async updateStatus(id: number, status: AppointmentStatus) {
    const appointment = await this.findOne(id);
    appointment.status = status;
    return this.appointmentRepo.save(appointment);
  }

  // Delete appointment
  async remove(id: number) {
    const result = await this.appointmentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return { deleted: true };
  }

  // Get current queue (Booked or In Progress)
  async getQueue() {
    return this.appointmentRepo.find({
      where: [
        { status: AppointmentStatus.WAITING },
        { status: AppointmentStatus.IN_PROGRESS },
        { status: AppointmentStatus.COMPLETED }
      ],
      relations: ['doctor'],
      order: { date: 'ASC', time: 'ASC' },
    });
  }


  // Get appointment history (Completed)
  async getHistory() {
    return this.appointmentRepo.find({
      where: { status: AppointmentStatus.COMPLETED },
      relations: ['doctor'],
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async cancel(id: number) {
  const appt = await this.appointmentRepo.findOne({ where: { id } });
  if (!appt) {
    throw new NotFoundException('Appointment not found');
  }
  appt.status = AppointmentStatus.CANCELLED;
  return this.appointmentRepo.save(appt);
}
}
