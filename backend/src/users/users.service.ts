import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.ensureAdmin(
      'admin@clinic.com',
      'admin123',
    );
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createAdmin(email: string, plainPassword: string) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    const user = this.usersRepository.create({ email, password: hash, role: 'admin' });
    return this.usersRepository.save(user);
  }

  async ensureAdmin(email: string, plainPassword: string) {
    const existing = await this.findByEmail(email);
    if (!existing) {
      console.log(`No admin found. Creating default admin: ${email} / ${plainPassword}`);
      return this.createAdmin(email, plainPassword);
    } else {
      console.log(`Admin already exists: ${existing.email}`);
    }
  }
}
