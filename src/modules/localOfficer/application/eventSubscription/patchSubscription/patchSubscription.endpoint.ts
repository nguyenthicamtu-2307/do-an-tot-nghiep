import { ApiResponse, ResponseInterceptor, UserTypes } from '@common';
import { JwtGuard } from '@modules/auth/guard';
import { RequestUser } from '@modules/auth/request-with-user.interface';
import {
  Body,
  Controller,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { PatchSubscriptionCommand } from './patchSubscription.command';
import { PatchSubscriptionRequestBody } from './patchSubscription.request-body';
import { PatchSubscriptionRequestParam } from './patchSubscription.request-param';

@ApiTags('Event Subscription')
@ApiBearerAuth()
@Controller({
  path: 'local-officers/event-subscriptions',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.LOCAL_OFFICER)
@UseInterceptors(ResponseInterceptor)
export class PatchSubscriptionEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Patch an event subscription by action' })
  @ApiResponse()
  @Patch(':id')
  patch(
    @Body() body: PatchSubscriptionRequestBody,
    @Param() { id }: PatchSubscriptionRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PatchSubscriptionCommand, void>(
      new PatchSubscriptionCommand(user.id, id, body),
    );
  }
}
