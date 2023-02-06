import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { ResponseBooleanDto } from '../types/response-boolean.dto';
import { teapot } from '../utils/custom-error';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  public async create(signUpUserDto: SignUpUserDto): Promise<User> {
    const user = structuredClone(signUpUserDto);
    user.password = await hash(user.password, Math.random());

    const entity: User = await this.usersRepository
      .save(user)
      .catch((e) => teapot(`[createUser failed]: ${e.detail || e.message}`));
    return entity;
  }

  public findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { id: 'ASC' } });
  }

  public findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = structuredClone(updateUserDto);
    if ('password' in user) {
      user.password = await hash(user.password, Math.random());
    }

    const entity = await this.findOneById(id);
    if (!entity) {
      teapot(`[updateUser failed]: can't find user ${id}`);
    }

    return this.usersRepository
      .save({ ...entity, ...user })
      .catch((e) => teapot(`[updateUser failed]: ${e.detail || e.message}`));
  }

  public async remove(id: number): Promise<User> {
    const entity = await this.findOneById(id);
    return this.usersRepository.remove(entity).catch((e) => teapot(`deleteUser failed: ${e.message}`));
  }

  public findUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  //? TL Request
  public async isUserExists(username: string): Promise<ResponseBooleanDto> {
    const value = Boolean(await this.usersRepository.findOneBy({ username }));
    return { value };
  }
}
