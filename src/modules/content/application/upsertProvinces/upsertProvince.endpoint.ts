import { ApiResponse, ResponseInterceptor } from '@common';
import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpsertProvinceCommand } from './upsertProvince.command';

@ApiTags('Contents')
@Controller({
  path: 'contents/provinces',
  version: '1',
})
@UseInterceptors(ResponseInterceptor)
export class UpsertProvinceEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Upsert provinces' })
  @ApiResponse()
  @Post()
  post(): Promise<void> {
    return this.commandBus.execute<UpsertProvinceCommand, void>(
      new UpsertProvinceCommand(),
    );
  }
}
