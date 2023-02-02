import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findUserById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  deleteUserById(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
