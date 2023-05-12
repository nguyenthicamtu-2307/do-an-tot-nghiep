import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';

export class PutEventRequestBody {
  @ApiPropertyOptional({
    example: 'Cơn bão số 3 - Bão Nanpan',
    description: 'Event name',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({
    description: 'Event type',
    example: EventType.STORM,
    enum: EventType,
  })
  @IsOptional()
  @IsEnum(EventType)
  readonly type?: EventType;

  @ApiPropertyOptional({
    description: 'End date',
    example: new Date(),
  })
  @IsOptional()
  @IsISO8601()
  readonly endDate?: string;

  @ApiPropertyOptional({
    description: 'Description',
    example:
      'Bão số 6 là một cơn bão có sức công phá lớn, gây thiệt hại to lớn về mặt tài sản của nhân dân.',
  })
  @IsOptional()
  @IsString()
  readonly description?: string;
}
