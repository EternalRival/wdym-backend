import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LobbiesService } from './lobbies.service';

@ApiTags('Lobbies')
@Controller('lobbies')
export class LobbiesController {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @Get('is-title-unique')
  private isLobbyTitleUnique(@Query('title') title: string): boolean {
    return this.lobbiesService.isLobbyTitleUnique(title);
  }

  @Get('is-password-correct')
  private isPasswordCorrect(@Query('uuid', ParseUUIDPipe) uuid: string, @Query('password') password: string): boolean {
    return this.lobbiesService.isPasswordCorrect(uuid, password);
  }

  @Get('is-lobby-owner')
  private isLobbyOwner(@Query('username') username: string): boolean {
    return this.lobbiesService.isLobbyOwner(username);
  }

  @ApiTags('⚠️Временное⚠️')
  @Get('temp-get-full-game-lobby-list')
  private tempGetFullGameLobbyList(): unknown {
    return this.lobbiesService.tempGetFullGameLobbyList();
  }
}
