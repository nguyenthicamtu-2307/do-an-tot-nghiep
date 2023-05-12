import { PrismaService } from '@db';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RescueActionType, UserType } from '@prisma/client';
import { PostRescueSubscriptionsCommand } from './postRescueSubscriptions.command';
import { PostRescueSubscriptionsRequestBody } from './postRescueSubscriptions.request-body';

@CommandHandler(PostRescueSubscriptionsCommand)
export class CreateEventHandler
  implements ICommandHandler<PostRescueSubscriptionsCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async postRescueSubscriptions(
    body: PostRescueSubscriptionsRequestBody,
    userId: string,
  ) {
    const rescueTeam = await this.dbContext.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        userType: true,
        id: true,
      },
    });

    if (rescueTeam?.userType !== UserType.RESCUE_TEAM)
      throw new ForbiddenException(
        'Bạn không được phép thực hiện hành động này.',
      );

    const { subscriptionIDs, fromMobile } = body;

    const subscriptions =
      await this.dbContext.localOfficerEventSubscription.findMany({
        where: {
          id: {
            in: subscriptionIDs,
          },
        },
      });

    if (subscriptions.some(({ isCompleted }) => isCompleted))
      throw new BadRequestException(
        'Một trong các xã này đã hoàn thành công tác cứu trợ.',
      );

    if (subscriptions.some(({ isCanceled }) => isCanceled))
      throw new BadRequestException(
        'Một trong các xã này đã hủy đăng ký sự kiện.',
      );

    const existedRescueSubscription =
      await this.dbContext.rescueTeamSubscription.findMany({
        where: {
          loEventSubscriptionId: {
            in: subscriptionIDs,
          },
        },
      });

    if (existedRescueSubscription.length > 0)
      throw new BadRequestException(
        'Bạn đã đăng ký cứu trợ cho một trong các xã này.',
      );

    if (fromMobile) {
      subscriptionIDs.map(async (subscriptionId) => {
        await this.dbContext.rescueTeamSubscription.create({
          data: {
            isApproved: true,
            originalnoney: 0,
            loEventSubscriptionId: subscriptionId,
            rescueTeamUserId: userId,
            histories: {
              create: {
                type: RescueActionType.SUBSCRIBE,
              },
            },
          },
        });
      });
    } else {
      subscriptionIDs.map(async (subscriptionId) => {
        await this.dbContext.rescueTeamSubscription.create({
          data: {
            originalnoney: 0,
            loEventSubscriptionId: subscriptionId,
            rescueTeamUserId: userId,
            histories: {
              create: {
                type: RescueActionType.SUBSCRIBE,
              },
            },
          },
        });
      });
    }
  }

  async execute(command: PostRescueSubscriptionsCommand): Promise<void> {
    await this.postRescueSubscriptions(command.body, command.userId);
  }
}
