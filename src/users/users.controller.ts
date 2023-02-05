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
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { IJwtGuardRequest } from '../types/auth';
import { CreateUserDto } from './user/create-user.dto';
import { User } from './user/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  private createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('POST users', createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  private findAll(): Promise<User[]> {
    console.log('GET users');
    return this.usersService.findAll();
  }

  @Get('id/:id')
  private findUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    console.log('GET users/id/:id', id);
    return this.usersService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  private deleteUserById(@Req() request: IJwtGuardRequest): Promise<User> {
    console.log('DELETE users', request.user);
    return this.usersService.deleteUserById(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  private updateUserById(@Req() request: IJwtGuardRequest, @Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('PUT users', request.user, createUserDto);
    return this.usersService.updateUserById(request.user.id, createUserDto);
  }

  @Get('has')
  private isUserExists(@Query('username') username: string): Promise<{ value: boolean }> {
    console.log('GET users/has', username);
    return this.usersService.isUserExists(username);
  }
}
