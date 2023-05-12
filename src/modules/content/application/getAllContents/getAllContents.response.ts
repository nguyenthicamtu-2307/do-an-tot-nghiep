import { ApiProperty } from '@nestjs/swagger';

export class ProvinceResponse {
  @ApiProperty({
    description: 'Province ID',
    example: '60eaaa6f1173335842c35663',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    description: 'Name',
    example: 'An Giang',
    required: true,
  })
  readonly name: string;

  @ApiProperty({
    description: 'Code',
    example: '89',
    required: true,
  })
  readonly code: string;

  @ApiProperty({
    description: 'Name with type',
    example: 'Tỉnh An Giang',
    required: true,
  })
  readonly nameWithType: string;
}

export class DistrictResponse {
  @ApiProperty({
    description: 'District ID',
    example: '60eaaa6f1173335842c3536a',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    description: 'Name',
    example: 'Ba Đình',
    required: true,
  })
  readonly name: string;

  @ApiProperty({
    description: 'Code',
    example: '001',
    required: true,
  })
  readonly code: string;

  @ApiProperty({
    description: 'Name with type',
    example: 'Quận Ba Đình',
    required: true,
  })
  readonly nameWithType: string;

  @ApiProperty({
    description: 'Parent code',
    example: '01',
    required: true,
  })
  readonly parentCode: string;

  @ApiProperty({
    description: 'Path',
    example: 'Ba Đình, Hà Nội',
    required: true,
  })
  readonly path: string;

  @ApiProperty({
    description: 'Path with type',
    example: 'Quận Ba Đình, Thành phố Hà Nội',
    required: true,
  })
  readonly pathWithType: string;
}

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

export class GetAllContentsResponse {
  @ApiProperty({
    description: 'List of provinces',
  })
  provinces: ProvinceResponse[];

  @ApiProperty({
    description: 'List of districts',
  })
  districts: DistrictResponse[];

  @ApiProperty({
    description: 'List of wards',
  })
  wards: WardResponse[];
}
