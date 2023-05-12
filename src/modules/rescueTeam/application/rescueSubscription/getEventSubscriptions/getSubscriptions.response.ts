import { ApiProperty } from '@nestjs/swagger';

export class LoEventSubscriptionResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Subscription ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 'A Dơi, Hướng Hóa, Quảng Trị',
    description: 'Địa phương cần được cứu trợ',
    required: true,
  })
  readonly path: string;

  @ApiProperty({
    example: 69,
    description: 'Số hộ dân cần được cứu trợ',
    required: true,
  })
  readonly householdsNumber: number;
}

export class GetSubscriptionsResponse {
  @ApiProperty({
    description: 'Danh sách các xã đã đăng ký sự kiện và đang cần cứu trợ',
    required: true,
    isArray: true,
  })
  readonly loEventSubscriptions: LoEventSubscriptionResponse[];
}
