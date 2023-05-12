import { ApiProperty } from '@nestjs/swagger';

export class GetProvinceDistrictRequestParam {
  @ApiProperty({
    description: 'Province ID',
    example: '187ecfa5-4916-4461-a1dd-409b177b45de',
  })
  id: string;
}
