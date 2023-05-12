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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import RequestUser from '../../../../auth/request-with-user.interface';
import { GetEventsQuery } from './getEvents.query';
import { GetEventsRequestQuery } from './getEvents.request-query';
import { GetEventsResponse } from './getEvents.response';

@ApiTags('Event Subscription')
@ApiBearerAuth()
@Controller({
  path: 'local-officers/events',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.LOCAL_OFFICER)
@UseInterceptors(PaginatedResponseInterceptor)
export class GetEventsWithSubscriptionEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get list of events with subscription' })
  @PaginatedApiResponse(GetEventsResponse)
  @Get()
  get(
    @Query() query: GetEventsRequestQuery,
    @Req() { user }: RequestUser,
  ): Promise<GetEventsResponse> {
    return this.queryBus.execute<GetEventsQuery, GetEventsResponse>(
      new GetEventsQuery(query, user.id),
    );
  }
}
