import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { LobbiesService } from './lobbies.service';

@ApiTags('Lobbies')
@Controller('lobbies')
export class LobbiesController {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @Get('is-title-unique')
  private isLobbyTitleUnique(@Param('title') title: string): boolean {
    return this.lobbiesService.isLobbyTitleUnique(title);
  }

  @ApiParam({ name: 'uuid', format: 'uuid' })
  @Get('is-password-correct')
  private isPasswordCorrect(@Param('uuid', ParseUUIDPipe) uuid: string, @Param('password') password: string): boolean {
    return this.lobbiesService.isPasswordCorrect(uuid, password);
  }

  @Get('is-lobby-owner')
  private isLobbyOwner(@Param('username') username: string): boolean {
    return this.lobbiesService.isLobbyOwner(username);
  }
}
