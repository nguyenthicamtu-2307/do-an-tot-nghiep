import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class HouseHoldRequestBody {
  @ApiProperty({
    example: 'Nguyễn Văn Tình',
    description: 'Họ và tên',
    type: String,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'Xóm 4, thôn Đại Hành, xã Đại Quán',
    description: 'Địa chỉ',
    type: String,
  })
  @IsString()
  readonly address: string;

  @ApiProperty({
    example: '0369745644',
    description: 'Số điện thoại',
    type: String,
  })
  @IsString()
  readonly phoneNumber: string;
}

export class PutSubscriptionRequestBody {
  @ApiProperty({
    example: 50,
    description: 'Số hộ dân cần cứu trợ',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly householdNumber: number;

  @ApiProperty({
    example: 'https://facebook.com',
    description: 'Link danh sách hộ dân cần cứu trợ',
  })
  @IsOptional()
  @IsUrl()
  readonly householdsListUrl: string;

  @ApiProperty({
    example: 10000000,
    description: 'Số tiền cần cứu trợ',
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly amountOfMoney: number;

  @ApiProperty({
    example: 'Gạo, quần áo, bột giặt',
    description: 'Danh sách nhu yếu phẩm đang cần được cứu trợ',
  })
  @IsOptional()
  @IsString()
  readonly neccessariesList: string;

  @ApiProperty({
    description: 'Danh sách hộ dân cần cứu trợ',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  readonly households: HouseHoldRequestBody[];
}
