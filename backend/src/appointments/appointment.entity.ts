import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';

export enum AppointmentStatus {
  BOOKED = 'Booked',
  IN_PROGRESS = 'With Doctor',
  WAITING = 'Waiting',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { eager: true })
  doctor: Doctor;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED
  })
  status: AppointmentStatus;
}
