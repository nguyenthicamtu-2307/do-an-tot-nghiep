import { ApiProperty } from '@nestjs/swagger';

export class WardResponse {
  @ApiProperty({
    description: 'Ward ID',
    example: '60eaaa721173335842c369a0',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    description: 'Name',
    example: ' An Lạc',
    required: true,
  })
  readonly name: string;

  @ApiProperty({
    description: 'Code',
    example: '27460',
    required: true,
  })
  readonly code: string;

  @ApiProperty({
    description: 'Name with type',
    example: 'Phường  An Lạc',
    required: true,
  })
  readonly nameWithType: string;

  @ApiProperty({
    description: 'Parent code',
    example: '777',
    required: true,
  })
  readonly parentCode: string;

  @ApiProperty({
    description: 'Path',
    example: ' An Lạc, Bình Tân, Hồ Chí Minh',
    required: true,
  })
  readonly path: string;

  @ApiProperty({
    description: 'Path with type',
    example: 'Phường  An Lạc, Quận Bình Tân, Thành phố Hồ Chí Minh',
    required: true,
  })
  readonly pathWithType: string;
}

export class GetAllWardsResponse {
  @ApiProperty({
    description: 'List of wards',
  })
  wards: WardResponse[];
}
