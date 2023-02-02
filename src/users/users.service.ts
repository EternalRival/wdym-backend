import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
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

  async isUsernameExistsInUsers(username: string): Promise<{ value: boolean }> {
    const value = Boolean(await this.usersRepository.findOneBy({ username }));
    return { value };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const encrypted = await hash(password, Math.random());
    const user = this.usersRepository.create({ username, password: encrypted });
    return this.usersRepository.save(user);
  }

  deleteUserById(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
