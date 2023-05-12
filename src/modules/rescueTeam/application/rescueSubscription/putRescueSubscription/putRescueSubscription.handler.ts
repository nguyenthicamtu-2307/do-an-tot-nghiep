import { PrismaService } from '@db';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PutRescueSubscriptionCommand } from './putRescueSubscription.command';
import { PutRescueSubscriptionRequestBody } from './putRescueSubscription.request-body';

@CommandHandler(PutRescueSubscriptionCommand)
export class PutRescueSubscriptionHandler
  implements ICommandHandler<PutRescueSubscriptionCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async putRescueSubscription(
    body: PutRescueSubscriptionRequestBody,
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

    const { originalnoney, fromMobile } = body;

    if (!fromMobile) {
      if (rescueSubscription.isRejected === true)
        throw new BadRequestException('Yêu cầu cứu trợ đã bị từ chối.');

      if (rescueSubscription.isApproved === false)
        throw new BadRequestException('Yêu cầu cứu trợ chưa được phê duyệt.');
    }

    if (rescueSubscription.isDone)
      throw new BadRequestException('Hoạt động cứu trợ đã hoàn thành.');

    await this.dbContext.rescueTeamSubscription.update({
      where: {
        id,
      },
      data: {
        originalnoney,
      },
    });
  }

  async execute({
    body,
    id,
    userId,
  }: PutRescueSubscriptionCommand): Promise<void> {
    await this.putRescueSubscription(body, userId, id);
  }
}
