import { PaginatedApiResponseDto } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus, UserType } from '@prisma/client';

export class UserResponse {
  @ApiProperty({
    example: 'bbbc5212-6df4-40ab-8715-6b64c74338e7',
    description: 'User ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: 'Nguyen Phi Thuong',
    description: 'Full name',
    required: true,
  })
  readonly fullName: string;

  @ApiProperty({
    example: 'phithuongnguyen@gmail.com',
    description: 'Email',
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    example: '0396541235',
    description: 'Phone number',
    required: true,
  })
  readonly phoneNumber: string;

  @ApiProperty({
    example: ' An Lạc, Bình Tân, Hồ Chí Minh',
    description: 'Address',
    required: true,
  })
  readonly address: string;

  @ApiProperty({
    example: `${UserType.ADMIN}`,
    description: 'User type',
    required: true,
  })
  readonly userType: UserType;

  @ApiProperty({
    example: `${UserStatus.ACTIVE}`,
    description: 'User status',
    required: true,
  })
  readonly userStatus: UserStatus;
}

export class GetUsersResponse extends PaginatedApiResponseDto<UserResponse> {
  @ApiProperty({
    description: 'List of users',
    isArray: true,
  })
  data: UserResponse[];
}
