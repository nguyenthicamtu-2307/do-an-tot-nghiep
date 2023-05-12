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
import { PatchEventCommand } from './patchEvent.command';
import { PatchEventRequestBody } from './patchEvent.request-body';
import { PatchEventRequestParam } from './patchEvent.request-param';

@ApiTags('Event')
@ApiBearerAuth()
@Controller({
  path: 'admin/events',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.ADMIN)
@UseInterceptors(ResponseInterceptor)
export class PatchEventEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Patch an event by action' })
  @ApiResponse()
  @Patch(':id')
  put(
    @Body() body: PatchEventRequestBody,
    @Param() { id }: PatchEventRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PatchEventCommand, void>(
      new PatchEventCommand(body, id, user.id),
    );
  }
}
