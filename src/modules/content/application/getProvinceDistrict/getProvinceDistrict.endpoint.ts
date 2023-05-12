import { ApiResponse, ResponseInterceptor } from '@common';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProvinceDistrictQuery } from './getProvinceDistrict.query';
import { GetProvinceDistrictRequestParam } from './getProvinceDistrict.request-param';
import { GetProvinceDistrictResponse } from './getProvinceDistrict.response';

@ApiTags('Contents')
@Controller({
  path: 'contents/provinces/:id/districts',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class GetProvinceDistrictsEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get district by province ID' })
  @ApiResponse(GetProvinceDistrictResponse)
  @Get()
  get(
    @Param() { id }: GetProvinceDistrictRequestParam,
  ): Promise<GetProvinceDistrictResponse> {
    return this.queryBus.execute<
      GetProvinceDistrictQuery,
      GetProvinceDistrictResponse
    >(new GetProvinceDistrictQuery(id));
  }
}
