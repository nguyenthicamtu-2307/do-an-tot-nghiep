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
import { GetDonationPostQuery } from './getDonationPost.query';
import { GetDonationPostRequestParam } from './getDonationPost.request-param';
import { GetDonationPostResponse } from './getDonationPost.response';

@ApiTags('Rescue Action')
@ApiBearerAuth()
@Controller({
  path: 'rescue-team/donation-posts',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.RESCUE_TEAM)
@UseInterceptors(ResponseInterceptor)
export class GetDonationPostEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get donation post by ID' })
  @ApiResponse(GetDonationPostResponse)
  @Get(':id')
  get(
    @Param() { id }: GetDonationPostRequestParam,
  ): Promise<GetDonationPostResponse> {
    return this.queryBus.execute<GetDonationPostQuery, GetDonationPostResponse>(
      new GetDonationPostQuery(id),
    );
  }
}
