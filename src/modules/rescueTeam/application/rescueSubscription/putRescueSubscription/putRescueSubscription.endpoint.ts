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
import { PutRescueSubscriptionCommand } from './putRescueSubscription.command';
import { PutRescueSubscriptionRequestBody } from './putRescueSubscription.request-body';
import { PutRescueSubscriptionRequestParam } from './putRescueSubscription.request-param';

@ApiTags('Rescue Subscription')
@ApiBearerAuth()
@Controller({
  path: 'rescue-team/rescue-subscriptions',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.RESCUE_TEAM)
@UseInterceptors(ResponseInterceptor)
export class PutRescueSubscriptionEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Cập nhật kế hoạch cứu trợ' })
  @ApiResponse()
  @Put(':id')
  put(
    @Body() body: PutRescueSubscriptionRequestBody,
    @Param() { id }: PutRescueSubscriptionRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PutRescueSubscriptionCommand, void>(
      new PutRescueSubscriptionCommand(body, id, user.id),
    );
  }
}
