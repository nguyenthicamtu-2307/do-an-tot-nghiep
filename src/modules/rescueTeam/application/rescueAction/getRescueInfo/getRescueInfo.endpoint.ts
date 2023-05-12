import { ApiResponse, ResponseInterceptor, UserTypes } from '@common';
import { JwtGuard } from '@modules/auth/guard';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { GetRescueInfoQuery } from './getRescueInfo.query';
import { GetRescueInfoRequestParam } from './getRescueInfo.request-param';
import { GetRescueInfoResponse } from './getRescueInfo.response';

@ApiTags('Rescue Action')
@ApiBearerAuth()
@Controller({
  path: 'rescue-team/rescue-subscriptions',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.RESCUE_TEAM)
@UseInterceptors(ResponseInterceptor)
export class GetRescueInfoEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get rescue info by rescue subscription ID' })
  @ApiResponse(GetRescueInfoResponse)
  @Get(':id')
  get(
    @Param() { id }: GetRescueInfoRequestParam,
  ): Promise<GetRescueInfoResponse> {
    return this.queryBus.execute<GetRescueInfoQuery, GetRescueInfoResponse>(
      new GetRescueInfoQuery(id),
    );
  }
}
