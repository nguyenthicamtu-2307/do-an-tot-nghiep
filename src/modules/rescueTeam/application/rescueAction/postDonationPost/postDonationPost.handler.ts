import { PrismaService } from '@db';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DonationPostStatus, RescueActionType } from '@prisma/client';
import dayjs from 'dayjs';
import { PostDonationPostCommand } from './postDonationPost.command';
import { PostDonationPostRequestBody } from './postDonationPost.request-body';

@CommandHandler(PostDonationPostCommand)
export class PostDonationPostHandler
  implements ICommandHandler<PostDonationPostCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async postDonationPost(
    body: PostDonationPostRequestBody,
    userId: string,
    subscriptionId: string,
  ) {
    const rescueSubscription =
      await this.dbContext.rescueTeamSubscription.findUnique({
        where: {
          id: subscriptionId,
        },
        include: {
          reliefPlan: true,
          donationPost: true,
        },
      });

    if (!rescueSubscription || rescueSubscription.rescueTeamUserId !== userId)
      throw new NotFoundException('Yêu cầu cứu trợ không tồn tại.');

    if (!rescueSubscription.reliefPlan)
      throw new NotFoundException(
        'Bạn phải tạo kế hoạch cứu trợ trước khi đăng bài kêu gọi quyên góp',
      );

    const {
      description,
      fromMobile,
      moneyNeed,
      donationNeccessaries,
      necessariesList,
      deadline,
    } = body;

    if (!fromMobile) {
      if (rescueSubscription.isRejected === true)
        throw new BadRequestException('Yêu cầu cứu trợ đã bị từ chối.');

      if (rescueSubscription.isApproved === false)
        throw new BadRequestException('Yêu cầu cứu trợ chưa được phê duyệt.');
    }

    if (rescueSubscription.isDone)
      throw new BadRequestException('Hoạt động cứu trợ đã hoàn thành.');

    if (rescueSubscription.donationPost)
      throw new BadRequestException('Bài đăng kêu gọi quyên góp đã tồn tại.');

    if (dayjs(deadline).isAfter(dayjs(rescueSubscription.reliefPlan.startAt)))
      throw new BadRequestException(
        'Thời hạn kêu gọi quyên góp phải trước ngày bắt đầu thực hiện cứu trợ.',
      );

    const donationPost = await this.dbContext.donationPost.create({
      data: {
        description,
        moneyNeed,
        necessariesList,
        rtSubscriptionId: rescueSubscription.id,
        deadline,
        status: DonationPostStatus.INCOMPLETED,
      },
    });

    if (donationNeccessaries && donationNeccessaries.length > 0) {
      await Promise.all([
        ...donationNeccessaries.map(({ id, quantity }) => {
          this.dbContext.donationNeccessary.create({
            data: {
              reliefNeccessaryId: id,
              donationPostId: donationPost.id,
              quantity,
            },
          });
        }),
      ]);
    }

    await this.dbContext.rescueActionHistory.create({
      data: {
        type: RescueActionType.DONATION_POST_CREATED,
        rtSubscriptionId: rescueSubscription.id,
      },
    });
  }

  async execute({
    body,
    subscriptionId,
    userId,
  }: PostDonationPostCommand): Promise<void> {
    await this.postDonationPost(body, userId, subscriptionId);
  }
}
