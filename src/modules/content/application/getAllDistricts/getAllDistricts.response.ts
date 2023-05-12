import { ApiProperty } from '@nestjs/swagger';

export class DistrictResponse {
  @ApiProperty({
    description: 'District ID',
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

export class GetAllDistrictsResponse {
  @ApiProperty({
    description: 'List of districts',
  })
  districts: DistrictResponse[];
}
