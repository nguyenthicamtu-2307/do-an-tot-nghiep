import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class DonationNecessaryRequestBody {
  @ApiProperty({
    example: '0bc93543-150d-4293-84c4-4ba81da65750',
    description: 'Neccessary ID',
  })
  @IsUUID()
  readonly id: string;

  @ApiProperty({
    example: 30,
    description: 'Số lượng',
  })
  @Type(() => Number)
  @IsNumber()
  readonly quantity: number;
}

export class PostDonationPostRequestBody {
  @ApiProperty({
    example: 'I write this donation post to ...',
    description: 'Mô tả ngắn',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: 300000,
    description: 'Số tiền kêu gọi',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly moneyNeed: number;

  @ApiPropertyOptional({
    example: '30 củi, 23 gạo, 34 dầu, 89 muối',
    description: 'Danh sách vật phẩm kêu gọi quyên góp (for mobile only)',
  })
  @IsOptional()
  @IsString()
  readonly necessariesList?: string;

  @ApiProperty({
    example: true,
    description: `From mobile?`,
  })
  @IsBoolean()
  readonly fromMobile: boolean;

  @ApiProperty({
    example: new Date(),
    description: `Hạn quyên góp`,
  })
  @IsNotEmpty()
  @IsISO8601()
  readonly deadline: string;

  @ApiPropertyOptional({
    description: `Danh sách nhu yếu phẩm kêu gọi cứu trợ (for web only)`,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DonationNecessaryRequestBody)
  readonly donationNeccessaries?: DonationNecessaryRequestBody[];
}
