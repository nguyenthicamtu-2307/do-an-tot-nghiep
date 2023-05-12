import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PostProofRequestBody {
  @ApiProperty({
    example:
      'https://www.notion.so/Qu-n-l-c-u-tr-ff8ce9f54b6b4e7d9f4c2dd060e848a3 https://www.youtube.com/watch?v=wEJd2RyGm8Q&ab_channel=AtlanticRecords https://www.youtube.com/watch?v=wPNCj5AfHWY&ab_channel=Ayase%2FYOASOBI',
    description: 'Danh sách link hình ảnh minh chứng',
    type: String,
  })
  @IsNotEmpty()
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  readonly proofUrls: string[];
}
