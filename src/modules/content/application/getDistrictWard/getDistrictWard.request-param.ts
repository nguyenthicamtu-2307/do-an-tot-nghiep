import { ApiProperty } from '@nestjs/swagger';

export class GetDistrictWardRequestParam {
  @ApiProperty({
    description: 'District ID',
    example: '187ecfa5-4916-4461-a1dd-409b177b45de',
  })
  id: string;
}
