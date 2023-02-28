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
import { UsersApiService } from './api.service';
import { SignUpUserDto } from '../dto/sign-up-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IJwtAuthGuardRequestDto } from '../auth/dto/jwt-auth.guard.dto';
import { LoggerTag } from '../../shared/enums/logger-tag.enum';

@ApiTags('Users')
@Controller('users')
export class UsersApiController {
  public logger = new Logger(LoggerTag.USERS);

  constructor(private readonly usersApiService: UsersApiService) {}

  @Post()
  @UsePipes(ValidationPipe)
  private create(@Body() signUpUserDto: SignUpUserDto): Promise<User> {
    return this.usersApiService.create(signUpUserDto);
  }

  @Get()
  private findAll(): Promise<User[]> {
    return this.usersApiService.findAll();
  }

  @Get('id/:id')
  private findOneById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersApiService.findOneById(id);
  }

  //? swagger не билдит хедер в swagger api
  @ApiHeader({ name: 'Authorization', description: 'Bearer: access_token' })
  @UseGuards(JwtAuthGuard)
  @Patch()
  @UsePipes(ValidationPipe)
  private update(@Req() request: IJwtAuthGuardRequestDto, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersApiService.update(request.user.id, updateUserDto);
  }

  //? swagger не билдит хедер в swagger api
  @ApiHeader({ name: 'Authorization', description: 'Bearer: access_token' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  private remove(@Req() request: IJwtAuthGuardRequestDto): Promise<User> {
    console.log('DELETE users', request.user);
    return this.usersApiService.remove(request.user.id);
  }

  //? TL Request
  @Get('has')
  private async isUserExists(@Query('username') username: string): Promise<boolean> {
    const isExists: boolean = await this.usersApiService.isUserExists(username);
    this.logger.log(`isExists: ${JSON.stringify(isExists)}`);
    return isExists;
  }
}
