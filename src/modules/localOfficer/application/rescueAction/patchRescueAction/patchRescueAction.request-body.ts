import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PatchRescueActionEnum } from '../rescueAction.enum';

export class PatchRescueActionRequestBody {
  @ApiProperty({
    example: PatchRescueActionEnum.MARK_AS_DONE,
    description: `Available value: ${PatchRescueActionEnum.MARK_AS_DONE}`,
    enum: PatchRescueActionEnum,
  })
  @IsNotEmpty()
  @IsEnum(PatchRescueActionEnum)
  readonly action: PatchRescueActionEnum;
}
