import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { PatchRescueSubscriptionEnum } from '../rescueSubscription.enum';

export class PatchRescueSubscriptionRequestBody {
  @ApiProperty({
    example: PatchRescueSubscriptionEnum.MARK_AS_DONE,
    description: `Patch rescue subscription by action. Available value: ${PatchRescueSubscriptionEnum.MARK_AS_DONE}`,
    enum: PatchRescueSubscriptionEnum,
  })
  @IsString()
  @IsEnum(PatchRescueSubscriptionEnum)
  readonly action: PatchRescueSubscriptionEnum;

  @ApiProperty({
    example: true,
    description: `From mobile?`,
  })
  @IsBoolean()
  readonly fromMobile: boolean;
}
