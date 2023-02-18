import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameLobbiesService } from './lobbies.service';

@ApiTags('Lobbies')
@Controller('lobbies')
export class GameLobbiesController {
  constructor(private readonly lobbiesService: GameLobbiesService) {}

  @Get('is-title-unique')
  private isLobbyTitleUnique(@Query('title') title: string): boolean {
    return this.lobbiesService.isLobbyTitleUnique(title);
  }

  @Get('is-password-correct')
  private isPasswordCorrect(@Query('uuid', ParseUUIDPipe) uuid: string, @Query('password') password: string): boolean {
    return this.lobbiesService.isPasswordCorrect(uuid, password);
  }

  @Get('is-lobby-owner')
  private isLobbyOwner(@Query('username') username: string, @Query('uuid', ParseUUIDPipe) uuid: string): boolean {
    return this.lobbiesService.isLobbyOwner(username, uuid);
  }

  @Get('is-user-can-join')
  private isUserCanJoin(@Query('username') username: string, @Query('uuid', ParseUUIDPipe) uuid: string): boolean {
    return this.lobbiesService.isUserCanJoin(username, uuid);
  }

  @ApiTags('⚠️Временное⚠️')
  @Get('temp-get-full-game-lobby-list')
  private tempGetFullGameLobbyList(): unknown {
    return this.lobbiesService.tempGetFullGameLobbyList();
  }
}
