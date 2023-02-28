import { IsEnum, IsOptional } from 'class-validator';
import { LobbyPrivacyType } from '../enums/lobby-privacy-type.enum';
import { ListChunkDto } from './list-chunk.dto';

export class LobbyListOptionsDto {
  @IsOptional()
  public chunk?: ListChunkDto;

  @IsOptional()
  @IsEnum(LobbyPrivacyType)
  public privacy?: LobbyPrivacyType;

  @IsOptional()
  public nameContains?: string;
}
