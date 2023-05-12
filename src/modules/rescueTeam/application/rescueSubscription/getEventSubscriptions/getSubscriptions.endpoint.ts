import { ApiResponse, ResponseInterceptor, UserTypes } from '@common';
import { JwtGuard } from '@modules/auth/guard';
import RequestUser from '@modules/auth/request-with-user.interface';
import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { GetSubscriptionsQuery } from './getSubscriptions.query';
import { GetSubscriptionsRequestParam } from './getSubscriptions.request-param';
import { GetSubscriptionsResponse } from './getSubscriptions.response';

@ApiTags('Rescue Subscription')
@ApiBearerAuth()
@Controller({
  path: 'rescue-team/events/:id/subscriptions',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.RESCUE_TEAM)
@UseInterceptors(ResponseInterceptor)
export class GetSubscriptionsEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get event subscriptions list by event by ID' })
  @ApiResponse()
  @Get()
  get(
    @Param() { id }: GetSubscriptionsRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<GetSubscriptionsResponse> {
    return this.queryBus.execute<
      GetSubscriptionsQuery,
      GetSubscriptionsResponse
    >(new GetSubscriptionsQuery(id, user.id));
  }
}
