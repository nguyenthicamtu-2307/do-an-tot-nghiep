import { ApiProperty } from '@nestjs/swagger';
import { UserStatus, UserType } from '@prisma/client';

export class GetUserResponse {
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
    example:
      'https://vtv1.mediacdn.vn/thumb_w/640/2022/12/6/061222-kate-winslet-titanic-16703130308401782618672.png',
    description: 'Avatar URL',
  })
  readonly avatarUrl?: string | null;

  @ApiProperty({
    example: 'An Lạc, Bình Tân, Hồ Chí Minh',
    description: 'Local office address',
  })
  readonly localOfficeAddress?: string | null;

  @ApiProperty({
    example: '526258ab-6778-4784-afdb-77b10777017c',
    description: 'Local office address',
  })
  readonly localOfficeDistrictId?: string | null;

  @ApiProperty({
    example: '526258ab-6778-4784-afdb-77b10777017c',
    description: 'Local office province ID',
  })
  readonly localOfficeProvinceId?: string | null;

  @ApiProperty({
    example: '526258ab-6778-4784-afdb-77b10777017c',
    description: 'Local office ward ID',
  })
  readonly localOfficeWardId?: string | null;

  @ApiProperty({
    example: false,
    description: 'Is current local officer?',
  })
  readonly isCurrentLocalOfficer?: boolean | null;

  @ApiProperty({
    example: 'Ngan hang Quan doi',
    description: 'Bank name',
  })
  readonly bankName?: string | null;

  @ApiProperty({
    example: '2069896513132',
    description: 'Bank account number',
  })
  readonly bankAccountNumber?: string | null;

  @ApiProperty({
    example: 'Sunlight Rescue Team',
    description: 'Bank account number',
  })
  readonly rescueTeamName?: string | null;

  @ApiProperty({
    example: false,
    description: 'Is super Admin',
  })
  readonly isSuperAdmin?: boolean | null;

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
