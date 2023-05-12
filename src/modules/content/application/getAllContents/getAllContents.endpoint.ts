import { ApiResponse, ResponseInterceptor } from '@common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllContentsQuery } from './getAllContents.query';
import { GetAllContentsResponse } from './getAllContents.response';

@ApiTags('Contents')
@Controller({
  path: 'contents',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class GetAllContentsEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all of contents' })
  @ApiResponse(GetAllContentsResponse)
  @Get()
  get(): Promise<GetAllContentsResponse> {
    return this.queryBus.execute<GetAllContentsQuery, GetAllContentsResponse>(
      new GetAllContentsQuery(),
    );
  }
}
