import { IsOrderQueryParam } from '@common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, UserStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { GetUsersOrderByEnum } from '../user.enum';

export class GetLocalOfficersRequestQuery {
  @ApiPropertyOptional({
    example: `${UserStatus.ACTIVE},${UserStatus.INACTIVE},${UserStatus.PENDING}`,
    description: 'Get users by status',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  readonly status?: UserStatus[];

  @ApiPropertyOptional({
    description: 'Search by: phone number, email',
    example: '0395902364',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly search?: string;

  @ApiPropertyOptional({
    description: 'Filter by Local Office Province ID',
    example: '526258ab-6778-4784-afdb-77b10777017c',
  })
  @IsOptional()
  @IsString()
  readonly provinceId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Local Office District ID',
    example: '526258ab-6778-4784-afdb-77b10777017c',
  })
  @IsOptional()
  @IsString()
  readonly districtId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Local Office Ward ID',
    example: '526258ab-6778-4784-afdb-77b10777017c',
  })
  @IsOptional()
  @IsString()
  readonly wardId?: string;

  @ApiPropertyOptional({
    description: 'Number of records to skip and then return the remainder',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    description: 'Number of records to return and then skip over the remainder',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({
    description: `Order by keyword. \n\n  ${Object.values(
      GetUsersOrderByEnum,
    )}`,
    example: `${GetUsersOrderByEnum.EMAIL}:${Prisma.SortOrder.asc}`,
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetUsersOrderByEnum)
  order?: string;
}
