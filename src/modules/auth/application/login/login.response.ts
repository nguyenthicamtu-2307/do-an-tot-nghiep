import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginResponse {
  @ApiProperty({
    example: `${UserType.ADMIN}|taylorswift@gmail.com`,
    description: 'Username',
  })
  @IsNotEmpty()
  @MaxLength(255)
  readonly username: string;

  @ApiProperty({
    description: 'Access Token',
  })
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;

  @ApiProperty({
    description: 'Refresh Token',
  })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
