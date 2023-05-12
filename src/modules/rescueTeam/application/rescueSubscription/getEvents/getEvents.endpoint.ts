import {
  PaginatedApiResponse,
  PaginatedResponseInterceptor,
  UserTypes,
} from '@common';
import { JwtGuard } from '@modules/auth/guard';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { GetEventsQuery } from './getEvents.query';
import { GetEventsRequestQuery } from './getEvents.request-query';
import { GetEventsResponse } from './getEvents.response';

@ApiTags('Rescue Subscription')
@ApiBearerAuth()
@Controller({
  path: 'rescue-team/events',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.RESCUE_TEAM)
@UseInterceptors(PaginatedResponseInterceptor)
export class GetEventsEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get list of events' })
  @PaginatedApiResponse(GetEventsResponse)
  @Get()
  get(@Query() option: GetEventsRequestQuery): Promise<GetEventsResponse> {
    return this.queryBus.execute<GetEventsQuery, GetEventsResponse>(
      new GetEventsQuery(option),
    );
  }
}
