import { ApiProperty } from '@nestjs/swagger';
import { EventStatus, EventType } from '@prisma/client';
import { PaginatedApiResponseDto } from '../../../../../common';

export class EventResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Event ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 'Bão số 9 - Bão Noru',
    description: 'Event name',
    required: true,
  })
  readonly name: string;

  @ApiProperty({
    example: EventType.FLOOD,
    description: 'Loại sự kiện',
    required: true,
  })
  readonly eventType: EventType;

  @ApiProperty({
    example: new Date(),
    description: 'Ngày bắt đầu',
    required: true,
  })
  readonly startAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Ngày kết thúc',
  })
  readonly endAt: Date | null;

  @ApiProperty({
    example: new Date(),
    description: 'Ngày thêm',
    required: true,
  })
  readonly createdAt: Date;

  @ApiProperty({
    example: 2016,
    description: 'Năm',
    required: true,
  })
  readonly year: number;

  @ApiProperty({
    example: new Date(),
    description: 'Ngày đóng đăng ký sự kiện',
  })
  readonly closedAt: Date | null;

  @ApiProperty({
    example: EventStatus.CLOSE,
    description: 'Trạng thái',
    required: true,
  })
  readonly status: EventStatus;

  @ApiProperty({
    example: '28b8bd00-852c-45cb-b9e6-efe8fcd96329',
    description: 'ID đăng ký sự kiện',
  })
  readonly eventSubscriptionId: string | null;
}

export class GetEventsResponse extends PaginatedApiResponseDto<EventResponse> {
  @ApiProperty({
    description: 'List of subscriptions',
    isArray: true,
  })
  data: EventResponse[];
}
