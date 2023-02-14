import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { LobbiesService } from './lobbies.service';

@ApiTags('Lobbies')
@Controller('lobbies')
export class LobbiesController {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @Get('is-title-unique')
  private isLobbyTitleUnique(@Query('title') title: string): boolean {
    return this.lobbiesService.isLobbyTitleUnique(title);
  }

  @ApiParam({ name: 'uuid', format: 'uuid' })
  @Get('is-password-correct')
  private isPasswordCorrect(@Query('uuid', ParseUUIDPipe) uuid: string, @Query('password') password: string): boolean {
    return this.lobbiesService.isPasswordCorrect(uuid, password);
  }

  @Get('is-lobby-owner')
  private isLobbyOwner(@Query('username') username: string): boolean {
    return this.lobbiesService.isLobbyOwner(username);
  }
}
