import { ApiResponse, ResponseInterceptor } from '@common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllContentsQuery } from './getAllWards.query';
import { GetAllWardsResponse } from './getAllWards.response';

@ApiTags('Contents')
@Controller({
  path: 'contents/wards',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class GetAllWardsEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all wards' })
  @ApiResponse(GetAllWardsResponse)
  @Get()
  get(): Promise<GetAllWardsResponse> {
    return this.queryBus.execute<GetAllContentsQuery, GetAllWardsResponse>(
      new GetAllContentsQuery(),
    );
  }
}
