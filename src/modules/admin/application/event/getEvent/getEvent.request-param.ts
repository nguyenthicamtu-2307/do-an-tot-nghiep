import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetEventRequestParam {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'Event ID',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;
}
