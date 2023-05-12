import { ApiProperty } from '@nestjs/swagger';

export class ProvinceResponse {
  @ApiProperty({
    description: 'Province ID',
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

export class GetAllProvincesResponse {
  @ApiProperty({
    description: 'List of provinces',
  })
  provinces: ProvinceResponse[];
}
