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
import { PutEventCommand } from './putEvent.command';
import { PutEventRequestBody } from './putEvent.request-body';
import { PutEventRequestParam } from './putEvent.request-param';

@ApiTags('Event')
@ApiBearerAuth()
@Controller({
  path: 'admin/events',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.ADMIN)
@UseInterceptors(ResponseInterceptor)
export class PutEventEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update an event' })
  @ApiResponse()
  @Put(':id')
  put(
    @Body() body: PutEventRequestBody,
    @Param() { id }: PutEventRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PutEventCommand, void>(
      new PutEventCommand(body, id, user.id),
    );
  }
}
