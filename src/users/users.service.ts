import { Catch, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository, DeleteResult, InsertResult, QueryFailedError, MustBeEntityError } from 'typeorm';
import { teapot } from '../utils/custom-error';
import { CreateUserDto } from './user/create-user.dto';
import { User } from './user/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = structuredClone(createUserDto);
    user.password = await hash(user.password, Math.random());

    const entity = this.usersRepository
      .save(user)
      .catch((e) => teapot(`[createUser failed]: ${e.detail || e.message}`));
    return entity;
  }

  public findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { id: 'ASC' } });
  }

  public findUserById(id: User['id']): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  public async deleteUserById(id: User['id']): Promise<User> {
    const entity = await this.findUserById(id);
    return this.usersRepository.remove(entity).catch((e) => teapot(`deleteUser failed: ${e.message}`));
  }

  public async updateUserById(id: User['id'], createUserDto: CreateUserDto): Promise<User> {
    const entity = await this.findUserById(id);
    if (!entity) {
      teapot(`updateUser failed: can't find user ${id}`);
    }
    return this.usersRepository
      .save({ ...entity, ...createUserDto })
      .catch((e) => teapot(`updateUser failed: ${e.detail || e.message}`));
  }

  public findUserByUsername(username: User['username']): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  public async isUserExists(username: User['username']): Promise<{ value: boolean }> {
    const value = Boolean(await this.usersRepository.findOneBy({ username }));
    return { value };
  }
}
