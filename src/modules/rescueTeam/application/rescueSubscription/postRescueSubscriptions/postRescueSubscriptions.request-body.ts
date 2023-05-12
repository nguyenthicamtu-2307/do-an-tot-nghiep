import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class PostRescueSubscriptionsRequestBody {
  @ApiProperty({
    description: `Subscription IDs`,
    example: `1e325f49-e431-4166-a4ca-57e3c59d332d,2edd73a7-3dff-442e-a3a1-f0b807d5bad2,405d0820-cb6f-49cc-b8b0-a8d8a1c3a149`,
    type: String,
  })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  subscriptionIDs: string[];

  @ApiProperty({
    example: true,
    description: `From mobile?`,
  })
  @IsBoolean()
  readonly fromMobile: boolean;
}
