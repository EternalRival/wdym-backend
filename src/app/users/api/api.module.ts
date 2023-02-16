import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersApiService } from './api.service';
import { UsersApiController } from './api.controller';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersApiController],
  providers: [UsersApiService],
  exports: [UsersApiService],
})
export class UsersApiModule {}
