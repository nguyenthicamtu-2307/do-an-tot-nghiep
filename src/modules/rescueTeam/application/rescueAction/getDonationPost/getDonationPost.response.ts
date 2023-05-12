import { ApiProperty } from '@nestjs/swagger';
import { DonationPostStatus } from '@prisma/client';

export class DonationNeccessaryResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Donation Neccessary ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 'Lorem ispum',
    description: 'Name',
  })
  readonly name: string | null;

  @ApiProperty({
    example: 20,
    description: 'Số lượng kêu gọi',
  })
  readonly quantity: number;

  @ApiProperty({
    example: 2,
    description: 'Số lượng đã quyên góp',
  })
  readonly donatedQuantity: number;
}

export class SponsorResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Donation Neccessary ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 'Lorem ispum',
    description: 'Name',
    required: true,
  })
  readonly name: string;
}

export class GetDonationPostResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Donation Post ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 'Lorem ispum',
    description: 'Description',
  })
  readonly description: string | null;

  @ApiProperty({
    example: 3000,
    description: 'Số tiền kêu gọi',
  })
  readonly moneyNeed: number;

  @ApiProperty({
    example: new Date(),
    description: 'Hạn quyên góp',
  })
  readonly deadline: string | null;

  @ApiProperty({
    example: DonationPostStatus.COMPLETED,
    description: 'Trạng thái',
  })
  readonly status: DonationPostStatus;

  @ApiProperty({
    example: 'Lorem ispum',
    description: 'Danh sách nhu yếu phẩm (for mobile only)',
  })
  readonly necessariesList: string | null;

  @ApiProperty({
    example: 2000,
    description: 'Số tiền đã quyên góp',
  })
  readonly donatedMoney: number;

  @ApiProperty({
    description: 'Danh sách nhu yếu phẩm (for web only)',
    isArray: true,
  })
  readonly necessaries: DonationNeccessaryResponse[];

  @ApiProperty({
    description: 'Danh sách mạnh thường quân đã quyên góp',
    isArray: true,
  })
  readonly sponsors: SponsorResponse[];
}
