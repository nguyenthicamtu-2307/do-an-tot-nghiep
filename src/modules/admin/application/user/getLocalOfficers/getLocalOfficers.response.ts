import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { PaginatedApiResponseDto } from '../../../../../common';

export class LocalOfficerResponse {
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
    example: false,
    description: 'Is current local officer?',
  })
  readonly isCurrentLocalOfficer?: boolean | null;

  @ApiProperty({
    example: ' An Lạc, Bình Tân, Hồ Chí Minh',
    description: 'Address',
    required: true,
  })
  readonly address: string;

  @ApiProperty({
    example: `${UserStatus.ACTIVE}`,
    description: 'User status',
    required: true,
  })
  readonly userStatus: UserStatus;
}

export class GetLocalOfficersResponse extends PaginatedApiResponseDto<LocalOfficerResponse> {
  @ApiProperty({
    description: 'List of local officer users',
    isArray: true,
  })
  data: LocalOfficerResponse[];
}
