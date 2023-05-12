import { ApiProperty } from '@nestjs/swagger';
import { DonationPostStatus } from '@prisma/client';

export class DonationNeccessaryResponse {
  @ApiProperty({
    example: 'Cui',
    description: 'name',
    required: true,
  })
  readonly name: string | null;

  @ApiProperty({
    example: 30,
    description: 'quantity',
  })
  readonly quantity: number | null;

  @ApiProperty({
    example: 30,
    description: 'Donated quantity',
  })
  readonly donatedQuantity: number | null;
}

export class DonationResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Donation Post ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 3000,
    description: 'Money need',
    required: true,
  })
  readonly moneyNeed: number;

  @ApiProperty({
    example: 2000,
    description: 'Donated money',
  })
  readonly donatedMoney: number | null;

  @ApiProperty({
    example: new Date(),
    description: 'Deadline',
  })
  readonly deadline: string | null;

  @ApiProperty({
    example: DonationPostStatus.INCOMPLETED,
    description: 'Status',
  })
  readonly status: DonationPostStatus;

  @ApiProperty({
    description: 'Status',
    isArray: true,
  })
  readonly neccessaries: DonationNeccessaryResponse[];
}

export class AidPackageNeccessaryResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Aid package neccessary ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 'Cui',
    description: 'name',
    required: true,
  })
  readonly name: string | null;

  @ApiProperty({
    example: 30,
    description: 'quantity',
    required: true,
  })
  readonly quantity: number | null;
}

export class AidPackageResponse {
  @ApiProperty({
    example: 30000,
    description: 'Số tiền trên mỗi phần quà cứu trợ',
  })
  readonly amountOfMoney: number | null;

  @ApiProperty({
    example: 60000,
    description: 'Tổng giá trị mỗi phần quà cứu trợ',
  })
  readonly totalValue: number | null;

  @ApiProperty({
    example: 'Củi gạo dầu muối',
    description: 'Danh sách nhu yếu phẩm (for mobile only)',
  })
  readonly neccessariesList: string | null;

  @ApiProperty({
    description:
      'Danh sách nhu yếu phẩm trên mỗi phần quà cứu trợ (for web only)',
    isArray: true,
  })
  readonly neccessaries: AidPackageNeccessaryResponse[];
}

export class ReliefPlanResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Relief plan ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: new Date(),
    description: 'Start at',
  })
  readonly startAt: string | null;

  @ApiProperty({
    example: new Date(),
    description: 'End at',
  })
  readonly endAt: string | null;

  @ApiProperty({
    example: 30000,
    description: 'original money',
  })
  readonly originalnoney: number | null;

  @ApiProperty({
    description: 'Aid package',
  })
  readonly aidPackage: AidPackageResponse | null;
}

export class GetRescueActionResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Local officer event subscription ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 30000,
    description: 'Số tiền cần được cứu trợ',
  })
  readonly amountOfMoney: number | null;

  @ApiProperty({
    example: 'Củi, gạo, dầu, muối',
    description: 'Danh sách nhu yếu phẩm (for mobile only)',
  })
  readonly neccessariesList: string | null;

  @ApiProperty({
    example: 'Dội cứu trợ Ánh Sao',
    description: 'Tên đội cứu trợ',
  })
  readonly rescueTeamName: string | null;

  @ApiProperty({
    example: '0bc93543-150d-4293-84c4-4ba81da65750',
    description: 'Đội cứu trợ User ID',
  })
  readonly rescueTeamUserId: string | null;

  @ApiProperty({
    example: 'https://www.uuidgenerator.net/version4',
    description: 'households List Url',
  })
  readonly householdsListUrl: string | null;

  @ApiProperty({
    example: new Date(),
    description: 'Thời gian đăng ký cứu trợ',
    required: true,
  })
  readonly createdAt: string;

  @ApiProperty({
    description: 'Kế hoạch cứu trợ',
  })
  readonly reliefPlan: ReliefPlanResponse | null;

  @ApiProperty({
    description: 'Bài đăng kêu gọi quyên góp',
  })
  readonly donationPost: DonationResponse | null;
}
