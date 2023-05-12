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
import { PostReliefPlanCommand } from './postReliefPlan.command';
import { PostReliefPlanRequestBody } from './postReliefPlan.request-body';
import { PostReliefPlanRequestParam } from './postReliefPlan.request-param';

@ApiTags('Rescue Action')
@ApiBearerAuth()
@Controller({
  path: 'rescue-team/rescue-subscriptions/:id/relief-plans',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.RESCUE_TEAM)
@UseInterceptors(ResponseInterceptor)
export class PostReliefPlanEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Tạo kế hoạch cứu trợ' })
  @ApiResponse()
  @Post()
  post(
    @Body() body: PostReliefPlanRequestBody,
    @Param() { id }: PostReliefPlanRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PostReliefPlanCommand, void>(
      new PostReliefPlanCommand(user.id, id, body),
    );
  }
}
