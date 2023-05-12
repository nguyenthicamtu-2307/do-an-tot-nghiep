import { PrismaService } from '@db';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserType } from '@prisma/client';
import { PutSubscriptionCommand } from './putSubscription.command';
import { PutSubscriptionRequestBody } from './putSubscription.request-body';

@CommandHandler(PutSubscriptionCommand)
export class PutSubscriptionHandler
  implements ICommandHandler<PutSubscriptionCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async putSubscription(
    userId: string,
    body: PutSubscriptionRequestBody,
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

    const {
      amountOfMoney,
      householdNumber,
      households,
      householdsListUrl,
      neccessariesList,
    } = body;

    await this.dbContext.$transaction(async (trx) => {
      const subscription = await trx.localOfficerEventSubscription.findUnique({
        where: {
          id: subscriptionId,
        },
        select: {
          id: true,
          isCompleted: true,
        },
      });

      if (subscription?.isCompleted)
        throw new BadRequestException('Đã hoàn thành cứu trợ cho sự kiện này.');

      const householdsList = households.map((household) => {
        return {
          address: household.address,
          phoneNumber: household.phoneNumber,
          name: household.name,
        };
      });

      await trx.localOfficerEventSubscription.update({
        where: {
          id: subscriptionId,
        },
        data: {
          amountOfMoney,
          householdsListUrl,
          householdsNumber: householdNumber,
          neccessariesList,
          houseHolds: {
            createMany: {
              data: [...householdsList],
            },
          },
        },
      });
    });
  }

  async execute({
    body,
    subscriptionId,
    userId,
  }: PutSubscriptionCommand): Promise<void> {
    await this.putSubscription(userId, body, subscriptionId);
  }
}
