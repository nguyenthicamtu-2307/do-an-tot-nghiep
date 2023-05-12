import { PrismaService } from '@db';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import { PatchRescueSubscriptionEnum } from '../rescueSubscription.enum';
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
          isDone: true,
          rescueTeamUserId: true,
        },
      });

    if (!rescueSubscription || rescueSubscription.rescueTeamUserId !== userId)
      throw new NotFoundException('Yêu cầu cứu trợ không tồn tại.');

    const { action, fromMobile } = body;

    if (!fromMobile) {
      if (rescueSubscription.isRejected === true)
        throw new BadRequestException('Yêu cầu cứu trợ đã bị từ chối.');

      if (rescueSubscription.isApproved === false)
        throw new BadRequestException('Yêu cầu cứu trợ chưa được phê duyệt.');
    }

    switch (action) {
      case PatchRescueSubscriptionEnum.MARK_AS_DONE:
        if (rescueSubscription.isDone)
          throw new BadRequestException('Hoạt động cứu trợ đã hoàn thành.');
        await this.dbContext.rescueTeamSubscription.update({
          where: {
            id,
          },
          data: {
            isDone: true,
            closedAt: dayjs().toDate(),
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
