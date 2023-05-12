import { ApiResponse, ResponseInterceptor } from '@common';
import { LocalAuthGuard } from '@modules/auth/guard';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginCommand } from './login.command';
import { LoginRequestBody } from './login.request-body';
import { LoginResponse } from './login.response';

@ApiTags('Authentication')
@Controller({
  path: 'auth/login',
  version: '1',
})
@UseGuards(LocalAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class LoginEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Login' })
  @ApiResponse(LoginResponse)
  @Post()
  post(@Body() body: LoginRequestBody): Promise<LoginResponse> {
    return this.commandBus.execute<LoginCommand, LoginResponse>(
      new LoginCommand(body.username, body.password),
    );
  }
}
