import { ApiResponse, ResponseInterceptor } from '@common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllProvincesQuery } from './getAllProvinces.query';
import { GetAllProvincesResponse } from './getAllProvinces.response';

@ApiTags('Contents')
@Controller({
  path: 'contents/provinces',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class GetAllProvincesEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all provinces' })
  @ApiResponse(GetAllProvincesResponse)
  @Get()
  get(): Promise<GetAllProvincesResponse> {
    return this.queryBus.execute<GetAllProvincesQuery, GetAllProvincesResponse>(
      new GetAllProvincesQuery(),
    );
  }
}
