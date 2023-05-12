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
import { PutDonationPostCommand } from './putDonationPost.command';
import { PutDonationPostRequestBody } from './putDonationPost.request-body';
import { PutDonationPostRequestParam } from './putDonationPost.request-param';

@ApiTags('Rescue Action')
@ApiBearerAuth()
@Controller({
  path: 'rescue-team/donation-posts',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.RESCUE_TEAM)
@UseInterceptors(ResponseInterceptor)
export class PutDonationPostEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Tạo bài đăng kêu gọi quyên góp' })
  @ApiResponse()
  @Put(':id')
  post(
    @Body() body: PutDonationPostRequestBody,
    @Param() { id }: PutDonationPostRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PutDonationPostCommand, void>(
      new PutDonationPostCommand(user.id, id, body),
    );
  }
}
