import { PrismaService } from '@db';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserType } from '@prisma/client';
import { ApproveLocalOfficerCommand } from './approveLocalOfficer.command';

@CommandHandler(ApproveLocalOfficerCommand)
export class ApproveLocalOfficerHandler
  implements ICommandHandler<ApproveLocalOfficerCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async approveLocalOfficer(id: string, requestUserId: string) {
    const user = await this.dbContext.user.findFirst({
      where: { id: requestUserId },
      select: { userType: true },
    });

    if (user?.userType !== UserType.ADMIN)
      throw new ForbiddenException(
        'Bạn không được phép thực hiện hành động này.',
      );

    await this.dbContext.$transaction(async (trx) => {
      const localOfficer = await trx.user.findFirst({
        where: {
          id,
        },
        select: {
          userType: true,
          localOfficerDistrictId: true,
          localOfficerProvinceId: true,
          localOfficerWardId: true,
          isCurrentLocalOfficer: true,
          id: true,
        },
      });

      if (!localOfficer)
        throw new NotFoundException('Không tìm thấy cán bộ địa phương này.');

      if (localOfficer.userType !== UserType.LOCAL_OFFICER)
        throw new BadRequestException(
          'Người dùng không phải là cán bộ địa phương',
        );

      if (localOfficer.isCurrentLocalOfficer)
        throw new BadRequestException(
          'Cán bộ địa phương này đã được xác nhận.',
        );

      const {
        localOfficerDistrictId,
        localOfficerProvinceId,
        localOfficerWardId,
      } = localOfficer;

      await this.dbContext.user.updateMany({
        where: {
          localOfficerDistrictId,
          localOfficerProvinceId,
          localOfficerWardId,
        },
        data: {
          isCurrentLocalOfficer: false,
        },
      });

      await this.dbContext.user.update({
        where: {
          id,
        },
        data: {
          isCurrentLocalOfficer: true,
        },
      });
    });
  }

  async execute({
    id,
    requestUserId,
  }: ApproveLocalOfficerCommand): Promise<void> {
    await this.approveLocalOfficer(id, requestUserId);
  }
}
