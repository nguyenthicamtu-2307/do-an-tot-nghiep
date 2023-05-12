import { ApiProperty } from '@nestjs/swagger';

export class HouseHoldResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'House hold ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: new Date(),
    description: 'Created at',
    required: true,
  })
  readonly createdAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Updated at',
    required: true,
  })
  readonly updatedAt: Date;

  @ApiProperty({
    example: 'La Thi Bay',
    description: 'Name',
    required: true,
  })
  readonly name: string;

  @ApiProperty({
    example: 'Đội 10, xã Hoà Quý',
    description: 'Address',
    required: true,
  })
  readonly address: string;

  @ApiProperty({
    example: '0355484621',
    description: 'Updated at',
    required: false,
  })
  readonly phoneNumber: string | null;

  @ApiProperty({
    example: false,
    description: 'Is completed?',
    required: true,
  })
  readonly isCompleted: boolean;
}

export class GetRescueInfoResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Rescue Subscription ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 'Thôn A, xã B, huyện C, tỉnh D',
    description: 'Path',
    required: true,
  })
  readonly path: string;

  @ApiProperty({
    example: 'Bão Noru',
    description: 'Tên sự kiện',
    required: true,
  })
  readonly eventName: string;

  @ApiProperty({
    example: new Date(),
    description: 'Thời gian đăng ký',
    required: true,
  })
  readonly subscribeAt: string;

  @ApiProperty({
    example: new Date(),
    description: 'Thời gian đóng sự kiện',
    required: true,
  })
  readonly closedAt: string;

  @ApiProperty({
    example: false,
    description: 'Is approved? (for web only)',
    required: true,
  })
  readonly isApproved: boolean;

  @ApiProperty({
    example: 60,
    description: 'Số hộ dân cần cứu trợ',
    required: true,
  })
  readonly householdNumber: number;

  @ApiProperty({
    example:
      'https://www.notion.so/Qu-n-l-c-u-tr-ff8ce9f54b6b4e7d9f4c2dd060e848a3',
    description: 'Danh sách hộ dân cần cứu trợ (URL)',
  })
  readonly householdsListUrl: string | null;

  @ApiProperty({
    description: 'Danh sách hộ dân cần cứu trợ',
    isArray: true,
  })
  readonly houseHolds: HouseHoldResponse[];
}
