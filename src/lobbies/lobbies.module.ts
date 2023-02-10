import { Module } from '@nestjs/common';
import { LobbiesService } from './lobbies.service';
import { LobbiesGateway } from './lobbies.gateway';

@Module({
  providers: [LobbiesGateway, LobbiesService],
})
export class LobbiesModule {}
