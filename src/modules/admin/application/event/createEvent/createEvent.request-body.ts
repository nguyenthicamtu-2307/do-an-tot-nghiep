import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventRequestBody {
  @ApiProperty({
    example: 'Cơn bão số 3 - Bão Nanpan',
    description: 'Event name',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Event type',
    example: EventType.STORM,
    enum: EventType,
  })
  @IsNotEmpty()
  @IsEnum(EventType)
  readonly type: EventType;

  @ApiProperty({
    description: 'Start date',
    example: new Date(),
  })
  @IsNotEmpty()
  @IsISO8601()
  readonly startDate: string;

  @ApiPropertyOptional({
    description: 'End date',
    example: new Date(),
  })
  @IsOptional()
  @IsISO8601()
  readonly endDate?: string;

  @ApiProperty({
    description: 'Description',
    example: 'laudantium voluptate a',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
