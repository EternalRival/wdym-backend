import { IsEnum, IsOptional } from 'class-validator';
import { LobbyPrivacyType } from '../enum/lobby-privacy-type.enum';
import { LobbyListChunkDto } from './lobby-list-chunk.dto';

export class LobbyListOptionsDto {
  @IsOptional()
  public chunk?: LobbyListChunkDto;

  @IsOptional()
  @IsEnum(LobbyPrivacyType)
  public privacy?: LobbyPrivacyType;

  @IsOptional()
  public nameContains?: string;
}
