import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ListChunkDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  public page!: number;

  @IsInt()
  @IsPositive() 
  @Type(() => Number)
  public limit!: number;
}
