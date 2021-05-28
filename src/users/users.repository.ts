import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { User } from './users.entity';
import { Roles } from '../roles/roles.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    email: string,
    password: string,
    salt: string,
  ): Promise<void> {
    const user = new User();
    user.email = email;
    user.password = password;
    user.salt = salt;

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
