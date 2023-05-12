import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequestBody {
  @ApiProperty({
    example: UserType.LOCAL_OFFICER,
    description: 'User type',
    enum: UserType,
  })
  @IsNotEmpty()
  @IsEnum(UserType)
  readonly userType: UserType;

  @ApiProperty({
    description: 'Email',
    example: 'phithuongnguyen@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @ApiProperty({
    description: 'Password',
    example: 'Abcd@1234',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  readonly password: string;

  @ApiProperty({
    description: 'First name',
    example: 'Thuong',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly firstName: string;

  @ApiPropertyOptional({
    description: 'Middle name',
    example: 'Phi',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly middleName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Nguyen',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly lastName: string;

  @ApiProperty({
    description: 'Phone number',
    example: '0375191332',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  readonly phoneNumber: string;

  @ApiProperty({
    description: 'Province ID',
    example: 'bc378f51-c255-4e11-b9e8-11aa63267ad1',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly provinceId: string;

  @ApiProperty({
    description: 'District ID',
    example: 'bc378f51-c255-4e11-b9e8-11aa63267ad1',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly districtId: string;

  @ApiProperty({
    description: 'Ward ID',
    example: 'bc378f51-c255-4e11-b9e8-11aa63267ad1',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly wardId: string;
}
