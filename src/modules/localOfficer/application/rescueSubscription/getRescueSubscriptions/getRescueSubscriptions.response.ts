import { PaginatedApiResponseDto } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class RescueSubscription {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Rescue team subscription ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: new Date(),
    description: 'Subscribe at',
    required: true,
  })
  readonly subscribeAt: string;

  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Rescue team ID',
    required: true,
  })
  readonly rescueTeamUserId: string;

  @ApiProperty({
    example: 'Đội cứu trợ Quang Minh',
    description: 'Rescue team name',
  })
  readonly rescueTeamName: string | null;

  @ApiProperty({
    example: 'Lý Quang Minh',
    description: 'Rescue team representative name',
  })
  readonly representative: string;

  @ApiProperty({
    example: false,
    description: 'Is approved?',
  })
  readonly isApproved: boolean;

  @ApiProperty({
    example: false,
    description: 'Is rejected?',
  })
  readonly isRejected: boolean;
}

export class GetRescueSubscriptionsResponse extends PaginatedApiResponseDto<RescueSubscription> {
  @ApiProperty({
    description: 'List of rescue subscriptions',
    isArray: true,
  })
  data: RescueSubscription[];
}
