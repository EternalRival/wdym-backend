import { Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe, Body, Delete } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  private findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Get('id/:id')
  private findUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @Get('user/:username') // TODO заменить user
  private isUsernameExistsInUsers(@Param('username') username: string): Promise<{ value: boolean }> {
    return this.usersService.isUsernameExistsInUsers(username);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  private createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete('id/:id')
  private deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.usersService.deleteUserById(id);
  }
}
