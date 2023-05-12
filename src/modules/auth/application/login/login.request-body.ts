import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestBody {
  @ApiProperty({
    example: `${UserType.RESCUE_TEAM.toLowerCase()}|phithuongnguyen+02@gmail.com`,
    description: 'Your username',
  })
  @IsNotEmpty()
  @MaxLength(255)
  readonly username: string;

  @ApiProperty({
    example: 'Abcd@1234',
    description: 'Your password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  readonly password: string;
}
