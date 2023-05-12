import { ApiResponse, ResponseInterceptor } from '@common';
import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpsertDistrictCommand } from './upsertDistrict.command';

@ApiTags('Contents')
@Controller({
  path: 'contents/districts',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class UpsertDistrictEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Upsert districts' })
  @ApiResponse()
  @Post()
  post(): Promise<void> {
    return this.commandBus.execute<UpsertDistrictCommand, void>(
      new UpsertDistrictCommand(),
    );
  }
}
