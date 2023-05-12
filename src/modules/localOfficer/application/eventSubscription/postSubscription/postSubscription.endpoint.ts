import { ApiResponse, ResponseInterceptor, UserTypes } from '@common';
import { JwtGuard } from '@modules/auth/guard';
import { RequestUser } from '@modules/auth/request-with-user.interface';
import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { PostSubscriptionCommand } from './postSubscription.command';
import { PostSubscriptionRequestBody } from './postSubscription.request-body';
import { PostSubscriptionRequestParam } from './postSubscription.request-param';

@ApiTags('Event Subscription')
@ApiBearerAuth()
@Controller({
  path: 'local-officers/events/:id/event-subscriptions',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.LOCAL_OFFICER)
@UseInterceptors(ResponseInterceptor)
export class PostSubscriptionEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Subscribe to an event by event ID' })
  @ApiResponse()
  @Post()
  post(
    @Body() body: PostSubscriptionRequestBody,
    @Param() { id }: PostSubscriptionRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PostSubscriptionCommand, void>(
      new PostSubscriptionCommand(user.id, id, body.householdNumber),
    );
  }
}
