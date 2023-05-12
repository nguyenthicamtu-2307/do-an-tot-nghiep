import { ApiResponse, ResponseInterceptor } from '@common';
import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpsertWardCommand } from './upsertWard.command';

@ApiTags('Contents')
@Controller({
  path: 'contents/wards',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class UpsertWardEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Upsert wards' })
  @ApiResponse()
  @Post()
  post(): Promise<void> {
    return this.commandBus.execute<UpsertWardCommand, void>(
      new UpsertWardCommand(),
    );
  }
}
