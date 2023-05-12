import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class PostSubscriptionRequestBody {
  @ApiProperty({
    example: 50,
    description: 'Số hộ dân cần cứu trợ',
    type: Number,
  })
  @IsNumber()
  @Min(1)
  readonly householdNumber: number;
}
