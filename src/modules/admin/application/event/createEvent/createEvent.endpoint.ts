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
import { CreateEventCommand } from './createEvent.command';
import { CreateEventRequestBody } from './createEvent.request-body';

@ApiTags('Event')
@ApiBearerAuth()
@Controller({
  path: 'admin/events',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.ADMIN)
@UseInterceptors(ResponseInterceptor)
export class CreateEventEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create an event' })
  @ApiResponse()
  @Post()
  post(
    @Body() body: CreateEventRequestBody,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<CreateEventCommand, void>(
      new CreateEventCommand(body, user),
    );
  }
}
