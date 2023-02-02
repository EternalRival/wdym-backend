import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Get('id/:id')
  findUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @Get('user/:username')
  isUsernameExistsInUsers(@Param('username') username: string): Promise<boolean> {
    return this.usersService.isUsernameExistsInUsers(username);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete('id/:id')
  deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.usersService.deleteUserById(id);
  }
}
