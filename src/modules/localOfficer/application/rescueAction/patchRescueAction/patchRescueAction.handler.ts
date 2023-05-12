import { PrismaService } from '@db';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserType } from '@prisma/client';
import { PatchRescueActionEnum } from '../rescueAction.enum';
import { PatchRescueActionCommand } from './patchRescueAction.command';
import { PatchRescueActionRequestBody } from './patchRescueAction.request-body';

@CommandHandler(PatchRescueActionCommand)
export class PatchRescueActionHandler
  implements ICommandHandler<PatchRescueActionCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async patchRescueAction(
    body: PatchRescueActionRequestBody,
    userId: string,
    id: string,
  ) {
    const loEventSubscription =
      await this.dbContext.localOfficerEventSubscription.findUnique({
        where: {
          id,
        },
        select: {
          localOfficer: {
            select: {
              localOfficerWardId: true,
            },
          },
          isCompleted: true,
          isCanceled: true,
        },
      });

    if (!loEventSubscription)
      throw new NotFoundException('Địa phương chưa đăng ký sự kiện');

    const localOfficer = await this.dbContext.user.findFirst({
      where: {
        id: userId,
        userType: UserType.LOCAL_OFFICER,
        isCurrentLocalOfficer: true,
      },
      select: {
        localOfficerWardId: true,
        isCurrentLocalOfficer: true,
      },
    });

    if (!localOfficer || !localOfficer.isCurrentLocalOfficer)
      throw new ForbiddenException(
        'Bạn không được phép thực hiện hành động này.',
      );

    if (
      localOfficer.localOfficerWardId !==
      loEventSubscription.localOfficer.localOfficerWardId
    )
      throw new BadRequestException(
        'Yêu cầu cứu trợ không thuộc địa phương của bạn.',
      );

    if (loEventSubscription.isCanceled)
      throw new BadRequestException('Địa phương đã hủy đăng ký sự kiện');

    if (loEventSubscription.isCompleted)
      throw new BadRequestException('Hoạt động cứu trợ đã hoàn thành');

    const { action } = body;

    switch (action) {
      case PatchRescueActionEnum.MARK_AS_DONE:
        await this.dbContext.localOfficerEventSubscription.update({
          where: {
            id,
          },
          data: {
            isCompleted: true,
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
  }: PatchRescueActionCommand): Promise<void> {
    await this.patchRescueAction(body, userId, subscriptionId);
  }
}
