import { ApiResponse, ResponseInterceptor, UserTypes } from '@common';
import { JwtGuard } from '@modules/auth/guard';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { GetEventQuery } from './getEvent.query';
import { GetEventRequestParam } from './getEvent.request-param';
import { GetEventResponse } from './getEvent.response';

@ApiTags('Event')
@ApiBearerAuth()
@Controller({
  path: 'admin/events',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.ADMIN)
@UseInterceptors(ResponseInterceptor)
export class GetEventEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get event by ID' })
  @ApiResponse(GetEventResponse)
  @Get(':id')
  get(@Param() { id }: GetEventRequestParam): Promise<GetEventResponse> {
    return this.queryBus.execute<GetEventQuery, GetEventResponse>(
      new GetEventQuery(id),
    );
  }
}
