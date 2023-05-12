import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class RefreshResponse {
  @ApiProperty({
    example: `${UserType.ADMIN}|taylorswift@gmail.com`,
    description: 'Username',
    required: true,
  })
  readonly username: string;

  @ApiProperty({
    description: 'Access Token',
    example: 'kdjlfdjfldjlfjdsl',
    required: true,
  })
  readonly accessToken: string;
}
