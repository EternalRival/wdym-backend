import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { GameMode } from '../enum/game-mode.enum';

export class CreateLobbyDto {
  @IsEnum(GameMode)
  public mode!: GameMode;

  @IsString()
  public title!: string;

  @IsString()
  public owner!: string;

  @IsString()
  public image!: string;

  @IsString()
  public password!: string;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public maxPlayers!: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public maxRounds!: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public timerDelay?: number;
}
