import { ResponseInterceptor } from '@common';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterCommand } from './register.command';
import { RegisterRequestBody } from './register.request-body';

@ApiTags('Authentication')
// @ApiBearerAuth()
@Controller({
  path: 'auth/register',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class RegisterEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Register' })
  @Post()
  post(@Body() body: RegisterRequestBody): Promise<void> {
    return this.commandBus.execute<RegisterCommand, void>(
      new RegisterCommand(body),
    );
  }
}
