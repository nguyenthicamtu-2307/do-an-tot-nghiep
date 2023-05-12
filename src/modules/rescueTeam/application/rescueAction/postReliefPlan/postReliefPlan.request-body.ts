import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AidPackageNeccessaryRequestBody {
  @ApiPropertyOptional({
    example: 'Củi',
    description: 'Neccessary nane',
  })
  @IsOptional()
  readonly name: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Số lượng',
  })
  @IsOptional()
  @IsNumber()
  readonly quantity: number;
}

export class PostReliefPlanRequestBody {
  @ApiPropertyOptional({
    example: new Date(),
    description: 'Thời gian bắt đầu thực hiện công tác cứu trợ',
  })
  @IsOptional()
  @IsISO8601()
  readonly startAt?: string;

  @ApiPropertyOptional({
    example: new Date(),
    description: 'Thời gian kết thúc thực hiện công tác cứu trợ',
  })
  @IsOptional()
  @IsISO8601()
  readonly endAt?: string;

  @ApiPropertyOptional({
    example: 300000,
    description: 'Số tiền trên một suất cứu trợ',
  })
  @IsOptional()
  @IsNumber()
  readonly aidPackageMoney?: number;

  @ApiPropertyOptional({
    example: 500000,
    description: 'Tổng giá trị một suất cứu trợ',
  })
  @IsOptional()
  @IsNumber()
  readonly aidPackageTotalValue?: number;

  @ApiProperty({
    example: true,
    description: `From mobile?`,
  })
  @IsBoolean()
  readonly fromMobile: boolean;

  @ApiProperty({
    example: '1 Củi, 2 gạo, 3 dầu, 4 muối',
    description: `Danh sách nhu yếu phẩm trong mỗi phần quà cứu trợ (for mobile only)`,
  })
  @IsOptional()
  @IsString()
  readonly aidPackageNeccessariesList?: string;

  @ApiPropertyOptional({
    description: `Danh sách nhu yếu phẩm trên một suất cứu trợ (for web only)`,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AidPackageNeccessaryRequestBody)
  readonly aidPackageNeccessaries?: AidPackageNeccessaryRequestBody[];
}
