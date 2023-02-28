import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({ name: 'uuid', required: false })
  private isLobbyOwner(@Query('username') username: string, @Query('uuid') uuid: string): boolean {
    return this.lobbiesService.isLobbyOwner(username, uuid);
  }

  @Get('can-user-join')
  private canUserJoin(@Query('username') username: string, @Query('uuid', ParseUUIDPipe) uuid: string): boolean {
    return this.lobbiesService.canUserJoin(username, uuid);
  }
}
