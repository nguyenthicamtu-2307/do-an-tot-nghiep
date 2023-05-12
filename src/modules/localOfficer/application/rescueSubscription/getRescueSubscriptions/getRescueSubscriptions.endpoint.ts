import {
  PaginatedApiResponse,
  PaginatedResponseInterceptor,
  UserTypes,
} from '@common';
import { JwtGuard } from '@modules/auth/guard';
import RequestUser from '@modules/auth/request-with-user.interface';
import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { GetRescueSubscriptionsQuery } from './getRescueSubscriptions.query';
import { GetRescueSubscriptionsResponse } from './getRescueSubscriptions.response';

@ApiTags('Local Office Rescue Subscription')
@ApiBearerAuth()
@Controller({
  path: 'local-officers/rescue-subscriptions',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.LOCAL_OFFICER)
@UseInterceptors(PaginatedResponseInterceptor)
export class GetRescueSubscriptionsEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get list of events with subscription' })
  @PaginatedApiResponse(GetRescueSubscriptionsResponse)
  @Get()
  get(@Req() { user }: RequestUser): Promise<GetRescueSubscriptionsResponse> {
    return this.queryBus.execute<
      GetRescueSubscriptionsQuery,
      GetRescueSubscriptionsResponse
    >(new GetRescueSubscriptionsQuery(user.id));
  }
}
