import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { PatchRescueSubscriptionEnum } from '../rescueAction.enum';

export class PatchRescueSubscriptionRequestBody {
  @ApiProperty({
    example: PatchRescueSubscriptionEnum.APPROVE,
    description: `Patch rescue subscription by action. Available value: ${PatchRescueSubscriptionEnum.APPROVE},${PatchRescueSubscriptionEnum.REJECT}`,
    enum: PatchRescueSubscriptionEnum,
  })
  @IsString()
  @IsEnum(PatchRescueSubscriptionEnum)
  readonly action: PatchRescueSubscriptionEnum;
}
