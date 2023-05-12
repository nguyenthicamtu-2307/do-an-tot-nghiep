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
import { PutReliefPlanCommand } from './putReliefPlan.command';
import { PutReliefPlanRequestBody } from './putReliefPlan.request-body';
import { PutReliefPlanRequestParam } from './putReliefPlan.request-param';

@ApiTags('Rescue Action')
@ApiBearerAuth()
@Controller({
  path: 'rescue-team/relief-plans',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.RESCUE_TEAM)
@UseInterceptors(ResponseInterceptor)
export class PutReliefPlanEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Chỉnh sửa kế hoạch cứu trợ' })
  @ApiResponse()
  @Put(':id')
  put(
    @Body() body: PutReliefPlanRequestBody,
    @Param() { id }: PutReliefPlanRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<PutReliefPlanCommand, void>(
      new PutReliefPlanCommand(user.id, id, body),
    );
  }
}
