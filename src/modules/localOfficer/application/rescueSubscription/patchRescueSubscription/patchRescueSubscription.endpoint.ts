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
import { PatchRescueSubscriptionCommand } from './patchRescueSubscription.command';
import { PatchRescueSubscriptionRequestBody } from './patchRescueSubscription.request-body';
import { PatchRescueSubscriptionRequestParam } from './patchRescueSubscription.request-param';

@ApiTags('Local Office Rescue Subscription')
@ApiBearerAuth()
@Controller({
  path: 'local-officers/rescue-subscriptions',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.LOCAL_OFFICER)
@UseInterceptors(ResponseInterceptor)
export class PatchRescueSubscriptionEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Patch an rescue subscription by action' })
  @ApiResponse()
  @Patch(':id')
  patch(
    @Body() body: PatchRescueSubscriptionRequestBody,
    @Param() { id }: PatchRescueSubscriptionRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PatchRescueSubscriptionCommand, void>(
      new PatchRescueSubscriptionCommand(body, id, user.id),
    );
  }
}
