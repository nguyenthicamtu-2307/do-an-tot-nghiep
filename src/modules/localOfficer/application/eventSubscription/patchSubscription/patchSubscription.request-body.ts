import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { PatchEventSubscriptionEnum } from '../eventSubscription.enum';

export class PatchSubscriptionRequestBody {
  @ApiProperty({
    example: PatchEventSubscriptionEnum.COMPLETE_RESCUE_ACTION,
    description: `Giá trị hợp lệ: \n\n${PatchEventSubscriptionEnum.COMPLETE_RESCUE_ACTION}: xác nhận hoàn thành công tác cứu trợ\n\n${PatchEventSubscriptionEnum.CANCEL}: hủy đăng ký sự kiện`,
    enum: PatchEventSubscriptionEnum,
  })
  @IsString()
  @IsEnum(PatchEventSubscriptionEnum)
  readonly action: PatchEventSubscriptionEnum;
}
