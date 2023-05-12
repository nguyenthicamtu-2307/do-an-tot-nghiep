import { PaginatedApiResponseDto } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatus, EventType } from '@prisma/client';

class AdminUserResponse {
  @ApiProperty({
    description: 'Admin user ID',
    example: '487971f1-018d-4973-bd50-4743bd716559',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Admin user full name',
    example: 'Nguyen Tan Dung',
    required: true,
  })
  fullName: string;
}

export class GetEventResponse {
  @ApiProperty({
    description: 'Event ID',
    example: '487971f1-018d-4973-bd50-4743bd716559',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Event type',
    example: `${EventType.FLOOD}`,
    required: true,
  })
  type: EventType;

  @ApiProperty({
    description: 'Event name',
    example: 'Cơn bão số 6 - Bão Nanpan',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Event created at',
    example: new Date(),
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Event start at',
    example: new Date(),
    required: true,
  })
  startAt: Date;

  @ApiProperty({
    description: 'Event end at',
    example: new Date(),
  })
  endAt: Date | null;

  @ApiProperty({
    description: 'Event closed at',
    example: new Date(),
  })
  closedAt: Date | null;

  @ApiProperty({
    description: 'Created by',
    required: true,
  })
  createdBy: AdminUserResponse;

  @ApiProperty({
    description: 'Closed by',
  })
  closedBy: AdminUserResponse | null;

  @ApiProperty({
    description: 'Event status',
    example: `${EventStatus.CLOSE}`,
    required: true,
  })
  status: EventStatus;

  @ApiProperty({
    description: 'Year',
    example: 2016,
    required: true,
  })
  year: number;

  @ApiProperty({
    description: 'Description',
    example:
      'Bão số 6 là một cơn bão mạnh, sức gió giật từ cấp 12 đến cấp 13, kèm theo lốc xoáy và gió giật mạnh.',
    required: true,
  })
  description: string;
}

export class GetEventsResponse extends PaginatedApiResponseDto<GetEventResponse> {
  @ApiProperty({
    description: 'List of events',
    isArray: true,
  })
  data: GetEventResponse[];
}
