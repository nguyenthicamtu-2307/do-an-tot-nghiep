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
import { GetRescueActionQuery } from './getRescueAction.query';
import { GetRescueActionRequestParam } from './getRescueAction.request-param';
import { GetRescueActionResponse } from './getRescueAction.response';

@ApiTags('Rescue Action Management')
@ApiBearerAuth()
@Controller({
  path: 'local-officers/event-subscriptions/:id/rescue-action',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.LOCAL_OFFICER)
@UseInterceptors(ResponseInterceptor)
export class GetRescueActionEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get an event subscription by ID' })
  @ApiResponse(GetRescueActionResponse)
  @Get()
  get(
    @Param() { id }: GetRescueActionRequestParam,
  ): Promise<GetRescueActionResponse> {
    return this.queryBus.execute<GetRescueActionQuery, GetRescueActionResponse>(
      new GetRescueActionQuery(id),
    );
  }
}
