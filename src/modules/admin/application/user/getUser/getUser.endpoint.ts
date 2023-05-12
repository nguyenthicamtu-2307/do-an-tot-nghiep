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
import { GetUserQuery } from './getUser.query';
import { GetUserRequestParam } from './getUser.request-param';
import { GetUserResponse } from './getUser.response';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller({
  path: 'admin/users',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.ADMIN)
@UseInterceptors(ResponseInterceptor)
export class GetUserEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get user by ID' })
  @ApiResponse(GetUserResponse)
  @Get(':id')
  get(@Param() { id }: GetUserRequestParam): Promise<GetUserResponse> {
    return this.queryBus.execute<GetUserQuery, GetUserResponse>(
      new GetUserQuery(id),
    );
  }
}
