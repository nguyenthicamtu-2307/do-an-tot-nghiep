import { ApiResponse, ResponseInterceptor } from '@common';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetDistrictWardQuery } from './getDistrictWard.query';
import { GetDistrictWardRequestParam } from './getDistrictWard.request-param';
import { GetDistrictWardsResponse } from './getDistrictWard.response';

@ApiTags('Contents')
@Controller({
  path: 'contents/districts/:id/wards',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class GetDistrictWardsEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get wards by district ID' })
  @ApiResponse(GetDistrictWardsResponse)
  @Get()
  get(
    @Param() { id }: GetDistrictWardRequestParam,
  ): Promise<GetDistrictWardsResponse> {
    return this.queryBus.execute<
      GetDistrictWardQuery,
      GetDistrictWardsResponse
    >(new GetDistrictWardQuery(id));
  }
}
