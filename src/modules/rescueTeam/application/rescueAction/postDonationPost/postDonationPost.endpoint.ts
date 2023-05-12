import { ApiResponse, ResponseInterceptor, UserTypes } from '@common';
import { JwtGuard } from '@modules/auth/guard';
import { RequestUser } from '@modules/auth/request-with-user.interface';
import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { PostDonationPostCommand } from './postDonationPost.command';
import { PostDonationPostRequestBody } from './postDonationPost.request-body';
import { PostDonationPostRequestParam } from './postDonationPost.request-param';

@ApiTags('Rescue Action')
@ApiBearerAuth()
@Controller({
  path: 'rescue-team/rescue-subscriptions/:id/donation-posts',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.RESCUE_TEAM)
@UseInterceptors(ResponseInterceptor)
export class PostDonationPostEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Tạo bài đăng kêu gọi quyên góp' })
  @ApiResponse()
  @Post()
  post(
    @Body() body: PostDonationPostRequestBody,
    @Param() { id }: PostDonationPostRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PostDonationPostCommand, void>(
      new PostDonationPostCommand(user.id, id, body),
    );
  }
}
