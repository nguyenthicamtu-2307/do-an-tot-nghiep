import { PrismaService } from '@db';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DonationPostStatus, RescueActionType } from '@prisma/client';
import dayjs from 'dayjs';
import { PutDonationPostCommand } from './putDonationPost.command';
import { PutDonationPostRequestBody } from './putDonationPost.request-body';

@CommandHandler(PutDonationPostCommand)
export class PutDonationPostHandler
  implements ICommandHandler<PutDonationPostCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async postDonationPost(
    body: PutDonationPostRequestBody,
    userId: string,
    id: string,
  ) {
    const donationPost = await this.dbContext.donationPost.findUnique({
      where: {
        id,
      },
      include: {
        rtSubscription: {
          include: {
            reliefPlan: true,
          },
        },
      },
    });

    if (!donationPost)
      throw new NotFoundException('Bài đăng kêu gọi quyên góp không tồn tại');

    const rescueSubscription = donationPost.rtSubscription;

    if (!rescueSubscription || rescueSubscription.rescueTeamUserId !== userId)
      throw new NotFoundException('Yêu cầu cứu trợ không tồn tại.');

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

    if (
      deadline &&
      dayjs(deadline).isAfter(dayjs(rescueSubscription.reliefPlan!.startAt))
    )
      throw new BadRequestException(
        'Thời hạn kêu gọi quyên góp phải trước ngày bắt đầu thực hiện cứu trợ.',
      );

    if (donationPost.status === DonationPostStatus.COMPLETED)
      throw new BadRequestException('Hoạt động quyên góp đã kết thúc.');

    await this.dbContext.donationPost.update({
      where: {
        id,
      },
      data: {
        description,
        moneyNeed,
        necessariesList,
        deadline,
      },
    });

    if (donationNeccessaries && donationNeccessaries.length > 0) {
      donationNeccessaries.map(
        async ({ neccessaryId, donationNeccessaryId, quantity }) => {
          if (donationNeccessaryId) {
            const foundDonationNeccessary =
              await this.dbContext.donationNeccessary.findFirst({
                where: {
                  reliefNeccessaryId: donationNeccessaryId,
                },
                include: {
                  reliefNeccessary: true,
                },
              });

            if (
              foundDonationNeccessary &&
              quantity < foundDonationNeccessary.donatedQuantity
            )
              throw new BadRequestException(
                `Số lượng ${foundDonationNeccessary.reliefNeccessary.name} được cập nhật không được nhỏ hơn số lượng đã được quyên góp`,
              );

            await this.dbContext.donationNeccessary.update({
              where: {
                id: donationNeccessaryId,
              },
              data: {
                quantity,
              },
            });
          }

          await this.dbContext.donationNeccessary.create({
            data: {
              reliefNeccessaryId: neccessaryId,
              donationPostId: donationPost.id,
              quantity,
            },
          });
        },
      );
    }

    await this.dbContext.rescueActionHistory.create({
      data: {
        type: RescueActionType.DONATION_POST_CREATED,
        rtSubscriptionId: rescueSubscription.id,
      },
    });
  }

  async execute({ body, id, userId }: PutDonationPostCommand): Promise<void> {
    await this.postDonationPost(body, userId, id);
  }
}
