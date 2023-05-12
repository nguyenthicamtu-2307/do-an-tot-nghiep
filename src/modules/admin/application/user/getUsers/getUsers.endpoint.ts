import { PaginatedApiResponse, ResponseInterceptor, UserTypes } from '@common';
import { JwtGuard } from '@modules/auth/guard';
import { RequestUser } from '@modules/auth/request-with-user.interface';
import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { GetUsersQuery } from './getUsers.query';
import { GetUsersRequestQuery } from './getUsers.request-query';
import { GetUsersResponse } from './getUsers.response';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller({
  path: 'admin/users',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.ADMIN)
@UseInterceptors(ResponseInterceptor)
export class GetUsersEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get a list of users' })
  @PaginatedApiResponse(GetUsersResponse)
  @Get()
  get(
    @Query() option: GetUsersRequestQuery,
    @Req() { user }: RequestUser,
  ): Promise<GetUsersResponse> {
    return this.queryBus.execute<GetUsersQuery, GetUsersResponse>(
      new GetUsersQuery(option, user.id),
    );
  }
}
