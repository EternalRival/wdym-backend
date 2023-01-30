import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/users.dto';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findUserById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findUserByLogin(login: string) {
    return this.userRepository.findOneBy({ login });
  }

  getUsers() {
    return this.userRepository.find();
  }

  deleteUser(id: number) {
    this.userRepository.delete(id);
  }
}
