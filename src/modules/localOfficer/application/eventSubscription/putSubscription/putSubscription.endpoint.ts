import { ApiResponse, ResponseInterceptor, UserTypes } from '@common';
import { JwtGuard } from '@modules/auth/guard';
import { RequestUser } from '@modules/auth/request-with-user.interface';
import {
  Body,
  Controller,
  Param,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { PutSubscriptionCommand } from './putSubscription.command';
import { PutSubscriptionRequestBody } from './putSubscription.request-body';
import { PutSubscriptionRequestParam } from './putSubscription.request-param';

@ApiTags('Event Subscription')
@ApiBearerAuth()
@Controller({
  path: 'local-officers/event-subscriptions',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.LOCAL_OFFICER)
@UseInterceptors(ResponseInterceptor)
export class PutSubscriptionEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update the subscription information' })
  @ApiResponse()
  @Put(':id')
  put(
    @Body() body: PutSubscriptionRequestBody,
    @Param() { id }: PutSubscriptionRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PutSubscriptionCommand, void>(
      new PutSubscriptionCommand(user.id, id, body),
    );
  }
}
