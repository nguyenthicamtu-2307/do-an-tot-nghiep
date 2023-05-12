import {
  PaginatedApiResponse,
  PaginatedResponseInterceptor,
  UserTypes,
} from '@common';
import { JwtGuard } from '@modules/auth/guard';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { GetLocalOfficerUserQuery } from './getLocalOfficers.query';
import { GetLocalOfficersRequestQuery } from './getLocalOfficers.request-query';
import { GetLocalOfficersResponse } from './getLocalOfficers.response';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller({
  path: 'admin/local-officers',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.ADMIN)
@UseInterceptors(PaginatedResponseInterceptor)
export class GetLocalOfficersEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get list of local Officers' })
  @PaginatedApiResponse(GetLocalOfficersResponse)
  @Get()
  get(
    @Query() option: GetLocalOfficersRequestQuery,
  ): Promise<GetLocalOfficersResponse> {
    return this.queryBus.execute<
      GetLocalOfficerUserQuery,
      GetLocalOfficersResponse
    >(new GetLocalOfficerUserQuery(option));
  }
}
