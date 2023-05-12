import { PrismaService } from '@db';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RescueActionType, UserType } from '@prisma/client';
import { PatchRescueSubscriptionEnum } from '../rescueAction.enum';
import { PatchRescueSubscriptionCommand } from './patchRescueSubscription.command';
import { PatchRescueSubscriptionRequestBody } from './patchRescueSubscription.request-body';

@CommandHandler(PatchRescueSubscriptionCommand)
export class PatchRescueSubscriptionHandler
  implements ICommandHandler<PatchRescueSubscriptionCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async patchRescueSubscription(
    body: PatchRescueSubscriptionRequestBody,
    userId: string,
    id: string,
  ) {
    const rescueSubscription =
      await this.dbContext.rescueTeamSubscription.findUnique({
        where: {
          id,
        },
        select: {
          isApproved: true,
          isRejected: true,
          loEventSubscription: {
            select: {
              localOfficer: {
                select: {
                  localOfficerWardId: true,
                },
              },
            },
          },
        },
      });

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
      rescueSubscription?.loEventSubscription.localOfficer.localOfficerWardId
    )
      throw new BadRequestException(
        'Yêu cầu cứu trợ không thuộc địa phương của bạn.',
      );

    const { action } = body;

    switch (action) {
      case PatchRescueSubscriptionEnum.APPROVE:
        if (rescueSubscription.isApproved)
          throw new BadRequestException('Yêu cầu cứu trợ đã được phê duyệt');
        await this.dbContext.rescueTeamSubscription.update({
          where: {
            id,
          },
          data: {
            isApproved: true,
            histories: {
              create: {
                type: RescueActionType.APPROVED,
              },
            },
          },
        });
        return;

      case PatchRescueSubscriptionEnum.REJECT:
        if (rescueSubscription.isRejected)
          throw new BadRequestException('Yêu cầu cứu trợ đã bị từ chối.');
        await this.dbContext.rescueTeamSubscription.update({
          where: {
            id,
          },
          data: {
            isRejected: true,
          },
        });
        return;

      default:
        return;
    }
  }

  async execute({
    body,
    id,
    userId,
  }: PatchRescueSubscriptionCommand): Promise<void> {
    await this.patchRescueSubscription(body, userId, id);
  }
}
