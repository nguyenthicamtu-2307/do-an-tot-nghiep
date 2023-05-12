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
import { PatchRescueActionCommand } from './patchRescueAction.command';
import { PatchRescueActionRequestBody } from './patchRescueAction.request-body';
import { PatchRescueActionRequestParam } from './patchRescueAction.request-param';

@ApiTags('Rescue Action Management')
@ApiBearerAuth()
@Controller({
  path: 'local-officers/event-subscriptions/:id/rescue-action',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.LOCAL_OFFICER)
@UseInterceptors(ResponseInterceptor)
export class PatchRescueActionEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Mark an rescue action is done' })
  @ApiResponse()
  @Patch(':id')
  patch(
    @Body() body: PatchRescueActionRequestBody,
    @Param() { id }: PatchRescueActionRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PatchRescueActionCommand, void>(
      new PatchRescueActionCommand(body, id, user.id),
    );
  }
}
