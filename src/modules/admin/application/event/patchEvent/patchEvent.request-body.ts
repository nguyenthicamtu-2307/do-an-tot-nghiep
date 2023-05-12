import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PatchEventByAction } from '../event.enum';

export class PatchEventRequestBody {
  @ApiProperty({
    description: 'Action',
    example: `Available value: ${PatchEventByAction.OPEN},${PatchEventByAction.CLOSE},${PatchEventByAction.PENDING}`,
    enum: PatchEventByAction,
  })
  @IsEnum(PatchEventByAction)
  readonly action: PatchEventByAction;
}
