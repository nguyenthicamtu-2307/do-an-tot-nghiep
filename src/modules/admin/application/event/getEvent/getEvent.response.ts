import { ApiProperty } from '@nestjs/swagger';
import { EventStatus, EventType } from '@prisma/client';

export class UserResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'User ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 'Phi Thuong Nguyen',
    description: 'User full name',
    required: true,
  })
  readonly fullName: string;
}

export class GetEventResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Event ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 'Cơn bão số 3 - Bão Nanpan',
    description: 'Event name',
    required: true,
  })
  readonly name: string;

  @ApiProperty({
    description: 'Event type',
    example: EventType.STORM,
    enum: EventType,
    required: true,
  })
  readonly type: EventType;

  @ApiProperty({
    description: 'Created at',
    example: new Date(),
    required: true,
  })
  readonly createdAt: string;

  @ApiProperty({
    description: 'Start date',
    example: new Date(),
    required: true,
  })
  readonly startDate: string;

  @ApiProperty({
    description: 'End date',
    example: new Date(),
  })
  readonly endDate: string | null;

  @ApiProperty({
    description: 'Description',
    example:
      'Et qui rerum quaerat fugit id repellat est. Consequatur non assumenda aut corrupti maxime. Dolor rerum cum eum occaecati explicabo impedit eum a voluptatem.',
    required: true,
  })
  readonly description: string;

  @ApiProperty({
    description: 'Created by',
    required: true,
  })
  readonly createdBy: UserResponse;

  @ApiProperty({
    description: 'Closed by',
  })
  readonly closedBy: UserResponse | null;

  @ApiProperty({
    description: 'Status',
    required: true,
  })
  readonly status: EventStatus;

  @ApiProperty({
    description: 'Year',
    required: true,
  })
  readonly year: number;
}
