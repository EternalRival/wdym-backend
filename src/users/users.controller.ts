import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './user/create-user.dto';
import { User } from './user/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  private createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  private findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  private findUserById(@Param('id', ParseIntPipe) id: User['id']): Promise<User> {
    return this.usersService.findUserById(id);
  }
  @Delete('id/:id')
  private deleteUserById(@Param('id', ParseIntPipe) id: User['id']): Promise<User> {
    return this.usersService.deleteUserById(id);
  }
  @Put('id/:id')
  private updateUserById(
    @Param('id', ParseIntPipe) id: User['id'],
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.updateUserById(id, createUserDto);
  }

  @Get('has')
  private isUserExists(@Query('username') username: string): Promise<{ value: boolean }> {
    return this.usersService.isUserExists(username);
  }
}
