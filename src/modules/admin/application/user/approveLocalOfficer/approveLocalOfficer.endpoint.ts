import { ApiResponse, ResponseInterceptor, UserTypes } from '@common';
import { JwtGuard } from '@modules/auth/guard';
import { RequestUser } from '@modules/auth/request-with-user.interface';
import {
  Controller,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { ApproveLocalOfficerCommand } from './approveLocalOfficer.command';
import { ApproveLocalOfficerRequestParam } from './approveLocalOfficer.request-param';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller({
  path: 'admin/users/local-officers',
  version: '1',
})
@UseGuards(JwtGuard)
@UserTypes(UserType.ADMIN)
@UseInterceptors(ResponseInterceptor)
export class ApproveLocalOfficerEndpoint {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Approve a local officer' })
  @ApiResponse()
  @Patch(':id')
  patch(
    @Param() { id }: ApproveLocalOfficerRequestParam,
    @Req() { user }: RequestUser,
  ): Promise<void> {
    return this.commandBus.execute<ApproveLocalOfficerCommand, void>(
      new ApproveLocalOfficerCommand(id, user.id),
    );
  }
}
