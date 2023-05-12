import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class PutRescueSubscriptionRequestBody {
  @ApiPropertyOptional({
    example: 2000000,
    description: 'Số tiền cứu trợ hiện có',
  })
  @IsOptional()
  @IsNumber()
  readonly originalnoney?: number;

  @ApiProperty({
    example: true,
    description: `From mobile?`,
  })
  @IsBoolean()
  readonly fromMobile: boolean;
}
