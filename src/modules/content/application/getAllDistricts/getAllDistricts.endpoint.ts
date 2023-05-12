import { ApiResponse, ResponseInterceptor } from '@common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllDistrictsQuery } from './getAllDistricts.query';
import { GetAllDistrictsResponse } from './getAllDistricts.response';

@ApiTags('Contents')
@Controller({
  path: 'contents/districts',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class GetAllDistrictsEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all of districts' })
  @ApiResponse(GetAllDistrictsResponse)
  @Get()
  get(): Promise<GetAllDistrictsResponse> {
    return this.queryBus.execute<GetAllDistrictsQuery, GetAllDistrictsResponse>(
      new GetAllDistrictsQuery(),
    );
  }
}
