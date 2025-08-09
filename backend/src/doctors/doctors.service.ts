import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  findAll() {
    return this.doctorRepo.find();
  }

  findOne(id: number) {
    return this.doctorRepo.findOne({ where: { id } });
  }

  create(doctor: Partial<Doctor>) {
    const newDoctor = this.doctorRepo.create(doctor);
    return this.doctorRepo.save(newDoctor);
  }

  async update(id: number, doctor: Partial<Doctor>) {
    await this.doctorRepo.update(id, doctor);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.doctorRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
