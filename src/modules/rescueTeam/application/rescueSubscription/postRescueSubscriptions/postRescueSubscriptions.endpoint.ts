import { ApiResponse, ResponseInterceptor, UserTypes } from '@common';
import { JwtGuard } from '@modules/auth/guard';
import { RequestUser } from '@modules/auth/request-with-user.interface';
import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { PostRescueSubscriptionsCommand } from './postRescueSubscriptions.command';
import { PostRescueSubscriptionsRequestBody } from './postRescueSubscriptions.request-body';

@ApiTags('Rescue Subscription')
@ApiBearerAuth()
@Controller({
  path: 'rescue-team/rescue-subscriptions',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.RESCUE_TEAM)
@UseInterceptors(ResponseInterceptor)
export class PostRescueSubscriptionsEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({
    description: 'Đội cứu trợ đăng ký cứu trợ tại các địa phương',
  })
  @ApiResponse()
  @Post()
  post(
    @Body() body: PostRescueSubscriptionsRequestBody,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PostRescueSubscriptionsCommand, void>(
      new PostRescueSubscriptionsCommand(user.id, body),
    );
  }
}
