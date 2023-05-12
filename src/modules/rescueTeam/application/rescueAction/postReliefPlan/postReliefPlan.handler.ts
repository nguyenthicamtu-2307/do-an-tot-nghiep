import { PrismaService } from '@db';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RescueActionType } from '@prisma/client';
import dayjs from 'dayjs';
import { PostReliefPlanCommand } from './postReliefPlan.command';
import { PostReliefPlanRequestBody } from './postReliefPlan.request-body';

@CommandHandler(PostReliefPlanCommand)
export class PostReliefPlanHandler
  implements ICommandHandler<PostReliefPlanCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async postReliefPlan(
    body: PostReliefPlanRequestBody,
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

    const {
      aidPackageMoney,
      fromMobile,
      aidPackageNeccessaries,
      aidPackageNeccessariesList,
      aidPackageTotalValue,
      endAt,
      startAt,
    } = body;

    if (startAt && endAt && dayjs(startAt).isAfter(dayjs(endAt)))
      throw new BadRequestException(
        'Thời gian bắt đầu và kết thúc hoạt động cứu trợ không hợp lệ.',
      );

    if (startAt && dayjs(startAt).isAfter(dayjs()))
      throw new BadRequestException(
        'Thời gian bắt đầu hoạt động cứu trợ không hợp lệ.',
      );

    if (endAt && dayjs(endAt).isBefore(dayjs()))
      throw new BadRequestException(
        'Thời gian kết thúc hoạt động cứu trợ không hợp lệ',
      );

    if (!fromMobile) {
      if (rescueSubscription.isRejected === true)
        throw new BadRequestException('Yêu cầu cứu trợ đã bị từ chối.');

      if (rescueSubscription.isApproved === false)
        throw new BadRequestException('Yêu cầu cứu trợ chưa được phê duyệt.');
    }

    if (rescueSubscription.isDone)
      throw new BadRequestException('Hoạt động cứu trợ đã hoàn thành.');

    await this.dbContext.$transaction(async (trx) => {
      const reliefPlan = await trx.reliefPlan.create({
        data: {
          endAt,
          startAt,
          rtSubscriptionId: id,
          aidPackage: {
            create: {
              neccessariesList: aidPackageNeccessariesList,
              totalValue: aidPackageTotalValue,
              amountOfMoney: aidPackageMoney,
            },
          },
        },
      });

      const aidPackage = await trx.aidPackage.create({
        data: {
          neccessariesList: aidPackageNeccessariesList,
          totalValue: aidPackageTotalValue,
          amountOfMoney: aidPackageMoney,
          reliefPlanId: reliefPlan.id,
        },
      });

      if (aidPackageNeccessaries && aidPackageNeccessaries.length > 0) {
        aidPackageNeccessaries.map(async ({ name, quantity }) => {
          await trx.reliefNeccessary.create({
            data: {
              reliefPlanId: reliefPlan.id,
              name,
              aidPackageNeccessary: {
                create: {
                  quantity,
                  aidPackageId: aidPackage.id,
                  name,
                },
              },
            },
          });
        });
      }

      await this.dbContext.rescueActionHistory.create({
        data: {
          rtSubscriptionId: id,
          type: RescueActionType.RELIEF_PLAN_CREATED,
        },
      });
    });
  }

  async execute({
    body,
    subscriptionId,
    userId,
  }: PostReliefPlanCommand): Promise<void> {
    await this.postReliefPlan(body, userId, subscriptionId);
  }
}
