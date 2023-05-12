import { PrismaService } from '@db';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RescueActionType } from '@prisma/client';
import dayjs from 'dayjs';
import { PutReliefPlanCommand } from './putReliefPlan.command';
import { PutReliefPlanRequestBody } from './putReliefPlan.request-body';

@CommandHandler(PutReliefPlanCommand)
export class PutReliefPlanHandler
  implements ICommandHandler<PutReliefPlanCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async putReliefPlan(
    body: PutReliefPlanRequestBody,
    userId: string,
    id: string,
  ) {
    const reliefPlan = await this.dbContext.reliefPlan.findUnique({
      where: {
        id,
      },
      include: {
        rtSubscription: true,
        aidPackage: true,
      },
    });

    if (!reliefPlan)
      throw new NotFoundException('Kế hoạch cứu trợ không tồn tại');

    if (
      !reliefPlan.rtSubscription ||
      reliefPlan.rtSubscription.rescueTeamUserId !== userId
    )
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
      if (reliefPlan.rtSubscription.isRejected === true)
        throw new BadRequestException('Yêu cầu cứu trợ đã bị từ chối.');

      if (reliefPlan.rtSubscription.isApproved === false)
        throw new BadRequestException('Yêu cầu cứu trợ chưa được phê duyệt.');
    }

    if (reliefPlan.rtSubscription.isDone)
      throw new BadRequestException('Hoạt động cứu trợ đã hoàn thành.');

    await this.dbContext.$transaction(async (trx) => {
      await trx.reliefPlan.update({
        where: {
          id,
        },
        data: {
          endAt,
          startAt,
        },
      });

      await trx.aidPackage.update({
        where: {
          id: reliefPlan.aidPackage!.id,
        },
        data: {
          amountOfMoney: aidPackageMoney,
          neccessariesList: aidPackageNeccessariesList,
          totalValue: aidPackageTotalValue,
        },
      });

      if (aidPackageNeccessaries && aidPackageNeccessaries.length > 0) {
        await trx.reliefNeccessary.deleteMany({
          where: {
            reliefPlanId: id,
          },
        });

        await trx.aidPackageNeccessary.deleteMany({
          where: {
            aidPackageId: reliefPlan.aidPackage!.id,
          },
        });

        aidPackageNeccessaries.map(async ({ name, quantity }) => {
          await trx.reliefNeccessary.create({
            data: {
              reliefPlanId: reliefPlan.id,
              name,
              aidPackageNeccessary: {
                create: {
                  quantity,
                  aidPackageId: reliefPlan.aidPackage!.id,
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
          type: RescueActionType.RELIEF_PLAN_UPDATED,
        },
      });
    });
  }

  async execute({
    body,
    reliefId,
    userId,
  }: PutReliefPlanCommand): Promise<void> {
    await this.putReliefPlan(body, userId, reliefId);
  }
}
