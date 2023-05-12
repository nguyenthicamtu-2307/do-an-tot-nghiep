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

  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Rescue team subscription ID',
    required: false,
  })
  readonly rtSubscriptionId: string | null;
}

export class GetSubscriptionResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Subscription ID',
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
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'ID cán bộ đăng ký sự kiện',
    required: true,
  })
  readonly localOfficerUserId: string;

  @ApiProperty({
    example: 'Le Thi Trieu',
    description: 'Họ và tên cán bộ đã đăng ký sự kiện',
    required: true,
  })
  readonly localOfficerName: string;

  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'ID sự kiện',
    required: true,
  })
  readonly eventId: string;

  @ApiProperty({
    example: 'Cơn bão số 8 - bão Yuminq',
    description: 'Tên sự kiện',
    required: true,
  })
  readonly eventName: string;

  @ApiProperty({
    example: false,
    description: 'Đã hoàn thành hoạt động cứu trợ?',
    required: true,
  })
  readonly isCompleted: boolean;

  @ApiProperty({
    example: 50,
    description: 'Số hộ dân cần cứu trợ',
    required: true,
  })
  readonly householdsNumber: number;

  @ApiProperty({
    example: 'https://flawless-current.com',
    description: 'Danh sách hộ dân cần cứu trợ (URL)',
    required: false,
  })
  readonly householdsListUrl: string | null;

  @ApiProperty({
    example: 1000000,
    description: 'Số tiền cần được cứu trợ',
    required: false,
  })
  readonly amountOfMoney: number | null;

  @ApiProperty({
    example: 'Củi, gạo, dầu, muối',
    description: 'Các nhu yếu phẩm cần được cứu trợ',
    required: false,
  })
  readonly neccessariesList: string | null;

  @ApiProperty({
    description: 'Danh sách hộ dân cần cứu trợ',
    isArray: true,
  })
  readonly houseHolds: HouseHoldResponse[];
}
