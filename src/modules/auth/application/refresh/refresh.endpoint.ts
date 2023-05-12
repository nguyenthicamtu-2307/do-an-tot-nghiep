import { ResponseInterceptor } from '@common';
import { RefreshGuard } from '@modules/auth/guard';
import { RequestUser } from '@modules/auth/request-with-user.interface';
import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshQuery } from './refresh.query';
import { RefreshResponse } from './refresh.response';

@ApiTags('Authentication')
@Controller({
  path: 'auth/refresh',
  version: '1',
})
@UseGuards(RefreshGuard)
@UseInterceptors(ResponseInterceptor)
export class RefreshEndpoint {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ description: 'Refresh' })
  @Get()
  get(@Req() req: RequestUser): Promise<RefreshResponse> {
    return this.queryBus.execute<RefreshQuery, RefreshResponse>(
      new RefreshQuery(req.user),
    );
  }
}
