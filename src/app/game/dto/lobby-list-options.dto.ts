import { IsEnum, IsOptional } from 'class-validator';
import { LobbyPrivacyType } from '../enum/lobby-privacy-type.enum';
import { ListChunkDto } from '../../shared/dto/list-chunk.dto';

export class LobbyListOptionsDto {
  @IsOptional()
  public chunk?: ListChunkDto;

  @IsOptional()
  @IsEnum(LobbyPrivacyType)
  public privacy?: LobbyPrivacyType;

  @IsOptional()
  public nameContains?: string;
}
