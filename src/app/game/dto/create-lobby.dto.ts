import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { GameMode } from '../enums/game-mode.enum';

export class CreateLobbyDto {
  @IsEnum(GameMode)
  public mode: GameMode = GameMode.DEFAULT;

  @IsString()
  public title: string = 'Game';

  @IsString()
  public owner: string = 'Player';

  @IsString()
  public image: string = '';

  @IsString()
  public password: string = '';

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public maxPlayers: number = 4;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public maxRounds: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public timerDelay: number = 30 * 1000;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public timerDelayVoteResults: number = 5 * 1000;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public timerDelayChooseSituations: number = 15 * 1000;
}
