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
import { GetSubscriptionQuery } from './getSubscription.query';
import { GetSubscriptionRequestParam } from './getSubscription.request-param';
import { GetSubscriptionResponse } from './getSubscription.response';

@ApiTags('Event Subscription')
@ApiBearerAuth()
@Controller({
  path: 'local-officers/event-subscriptions',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.LOCAL_OFFICER)
@UseInterceptors(ResponseInterceptor)
export class GetSubscriptionEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get an event subscription by ID' })
  @ApiResponse(GetSubscriptionResponse)
  @Get(':id')
  get(
    @Param() { id }: GetSubscriptionRequestParam,
  ): Promise<GetSubscriptionResponse> {
    return this.queryBus.execute<GetSubscriptionQuery, GetSubscriptionResponse>(
      new GetSubscriptionQuery(id),
    );
  }
}
