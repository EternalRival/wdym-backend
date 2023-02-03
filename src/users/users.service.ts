import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository, DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {}

  public findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public findUserById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  public findUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  public async isUsernameExistsInUsers(username: string): Promise<{ value: boolean }> {
    const value = Boolean(await this.usersRepository.findOneBy({ username }));
    return { value };
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const encrypted = await hash(password, Math.random());
    const user = this.usersRepository.create({ username, password: encrypted });
    return this.usersRepository.save(user);
  }

  public deleteUserById(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
