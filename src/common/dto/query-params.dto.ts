import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @Type(() => Number)
  take?: number = 10;

  @IsOptional()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  skip?: number = 0;
}
