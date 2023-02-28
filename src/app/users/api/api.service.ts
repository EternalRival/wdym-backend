import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { teapot } from '../../../utils/custom-error';
import { SignUpUserDto } from '../dto/sign-up-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersApiService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  public async create(signUpUserDto: SignUpUserDto): Promise<User> {
    const user = structuredClone(signUpUserDto);
    user.password = await hash(user.password, Math.random());

    const entity: User = await this.usersRepository.save(user).catch((e) => {
      throw teapot(`[createUser failed]: ${e.detail || e.message}`);
    });
    return entity;
  }

  public findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { id: 'ASC' } });
  }

  public async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!(user instanceof User)) {
      throw teapot('user not found');
    }
    return user;
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = structuredClone(updateUserDto);
    if ('password' in user && typeof user.password === 'string') {
      user.password = await hash(user.password, Math.random());
    }

    const entity = await this.findOneById(id);
    if (!entity) {
      teapot(`[updateUser failed]: can't find user ${id}`);
    }

    return this.usersRepository.save({ ...entity, ...user }).catch((e) => {
      throw teapot(`[updateUser failed]: ${e.detail || e.message}`);
    });
  }

  public async remove(id: number): Promise<User> {
    const entity: User = await this.findOneById(id);
    return this.usersRepository.remove(entity).catch((e) => {
      throw teapot(`deleteUser failed: ${e.message}`);
    });
  }

  public async findUserByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!(user instanceof User)) {
      throw teapot(`User ${username} not found`);
    }
    return user;
  }

  //? TL Request
  public async isUserExists(username: string): Promise<boolean> {
    const entity = await this.usersRepository.findOneBy({ username });
    return entity instanceof User;
  }
}
