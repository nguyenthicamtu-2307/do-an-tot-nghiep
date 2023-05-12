import { IsOrderQueryParam } from '@common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatus, EventType, Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { GetEventsOrderByEnum } from '../event.enum';

export class GetEventsRequestQuery {
  @ApiPropertyOptional({
    description: `Get events by types`,
    example: `${EventType.FLOOD},${EventType.LANDSLIDE},${EventType.STORM},${EventType.TSUNAMI}`,
    enum: EventType,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  types?: EventType[];

  @ApiPropertyOptional({
    description: `Get events by creating admin user ID`,
    example: 'cfaca9e1-0e7e-41dc-b08b-eb8204e7a728',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  creatingAdminUserId?: string;

  @ApiPropertyOptional({
    description: `Get events by closing admin user ID`,
    example: 'cfaca9e1-0e7e-41dc-b08b-eb8204e7a728',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  closingAdminUserId?: string;

  @ApiPropertyOptional({
    description: `Get events by statuses`,
    example: `${EventStatus.CLOSE},${EventStatus.OPEN},${EventStatus.PENDING}`,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  statuses?: EventStatus[];

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
      GetEventsOrderByEnum,
    )}`,
    example: `${GetEventsOrderByEnum.EVENT_TYPE}:${Prisma.SortOrder.asc}`,
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetEventsOrderByEnum)
  order?: string;

  @ApiPropertyOptional({
    description: 'Search by name',
    example: 'Bão số 6 - Cơn bão Nanpan',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Search by year',
    example: 2016,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({
    description: 'From date',
    example: '2023-01-01T15:46:19.261Z',
  })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({
    description: 'To date',
    example: '2023-04-19T15:46:19.261Z',
  })
  @IsOptional()
  @IsISO8601()
  to?: string;
}
