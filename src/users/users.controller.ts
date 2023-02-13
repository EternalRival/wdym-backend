import { ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseBooleanDto } from '../shared/dto/response-boolean.dto';
import { IJwtAuthGuardRequest } from '../auth/interfaces/jwt-auth.guard.interface';
import { LoggerTag } from '../logger/enums/logger-tag.enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  public logger = new Logger(LoggerTag.USERS);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  private create(@Body() signUpUserDto: SignUpUserDto): Promise<User> {
    return this.usersService.create(signUpUserDto);
  }

  @Get()
  private findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  private findOneById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }

  //? swagger не билдит хедер в swagger api
  @ApiHeader({ name: 'Authorization', description: 'Bearer: access_token' })
  @UseGuards(JwtAuthGuard)
  @Patch()
  @UsePipes(ValidationPipe)
  private update(@Req() request: IJwtAuthGuardRequest, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(request.user.id, updateUserDto);
  }

  //? swagger не билдит хедер в swagger api
  @ApiHeader({ name: 'Authorization', description: 'Bearer: access_token' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  private remove(@Req() request: IJwtAuthGuardRequest): Promise<User> {
    console.log('DELETE users', request.user);
    return this.usersService.remove(request.user.id);
  }

  //? TL Request
  @Get('has')
  private async isUserExists(@Query('username') username: string): Promise<ResponseBooleanDto> {
    const isExists = await this.usersService.isUserExists(username);
    this.logger.log(`isExists: ${JSON.stringify(isExists)}`);
    return isExists;
  }
}
