import { PrismaService } from '@db';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserType } from '@prisma/client';
import { PatchEventSubscriptionEnum } from '../eventSubscription.enum';
import { PatchSubscriptionCommand } from './patchSubscription.command';
import { PatchSubscriptionRequestBody } from './patchSubscription.request-body';

@CommandHandler(PatchSubscriptionCommand)
export class PatchSubscriptionHandler
  implements ICommandHandler<PatchSubscriptionCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async patchSubscription(
    userId: string,
    { action }: PatchSubscriptionRequestBody,
    subscriptionId: string,
  ) {
    const user = await this.dbContext.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        userType: true,
        localOfficerDistrictId: true,
        localOfficerProvinceId: true,
        localOfficerWardId: true,
        isCurrentLocalOfficer: true,
      },
    });

    if (user?.userType !== UserType.LOCAL_OFFICER)
      throw new ForbiddenException(
        'Bạn không được phép thực hiện hành động này.',
      );

    if (!user.isCurrentLocalOfficer)
      throw new ForbiddenException(
        'Bạn không phải là cán bộ của địa phương hiện tại.',
      );

    const subscription =
      await this.dbContext.localOfficerEventSubscription.findUnique({
        where: {
          id: subscriptionId,
        },
        select: {
          id: true,
          isCompleted: true,
          isCanceled: true,
        },
      });

    if (subscription?.isCompleted)
      throw new BadRequestException('Đã hoàn thành cứu trợ cho sự kiện này.');

    if (subscription?.isCanceled)
      throw new BadRequestException('Đã hủy đăng ký sự kiện này');

    switch (action) {
      case PatchEventSubscriptionEnum.COMPLETE_RESCUE_ACTION:
        await this.dbContext.localOfficerEventSubscription.update({
          where: {
            id: subscriptionId,
          },
          data: {
            isCompleted: true,
          },
        });
        return;

      case PatchEventSubscriptionEnum.CANCEL:
        await this.dbContext.localOfficerEventSubscription.update({
          where: {
            id: subscriptionId,
          },
          data: {
            isCanceled: true,
          },
        });
        return;

      default:
        return;
    }
  }

  async execute({
    body,
    subscriptionId,
    userId,
  }: PatchSubscriptionCommand): Promise<void> {
    await this.patchSubscription(userId, body, subscriptionId);
  }
}
