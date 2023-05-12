import { PrismaService } from '@db';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetSubscriptionQuery } from './getSubscription.query';
import { GetSubscriptionResponse } from './getSubscription.response';

type GetSubscriptionDto = Prisma.LocalOfficerEventSubscriptionGetPayload<{
  select: {
    id: true;
    amountOfMoney: true;
    createdAt: true;
    householdsNumber: true;
    householdsListUrl: true;
    updatedAt: true;
    isCompleted: true;
    neccessariesList: true;
    houseHolds: {
      select: {
        id: true;
        address: true;
        isCompleted: true;
        createdAt: true;
        updatedAt: true;
        name: true;
        phoneNumber: true;
        rtSubscriptionId: true;
      };
    };
    event: {
      select: {
        id: true;
        name: true;
      };
    };
    localOfficer: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        middleName: true;
      };
    };
  };
}>;

@QueryHandler(GetSubscriptionQuery)
export class GetSubscriptionHandler
  implements IQueryHandler<GetSubscriptionQuery, GetSubscriptionResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(subscription: GetSubscriptionDto): GetSubscriptionResponse {
    const {
      amountOfMoney,
      createdAt,
      event: { id: eventId, name: eventName },
      houseHolds,
      householdsListUrl,
      householdsNumber,
      id,
      isCompleted,
      localOfficer: { firstName, id: localOfficerId, lastName, middleName },
      updatedAt,
      neccessariesList,
    } = subscription;

    return {
      id,
      amountOfMoney,
      createdAt,
      updatedAt,
      eventId,
      eventName,
      houseHolds: houseHolds.map(
        ({
          address,
          createdAt,
          id,
          isCompleted,
          name,
          phoneNumber,
          rtSubscriptionId,
          updatedAt,
        }) => {
          return {
            address,
            createdAt,
            id,
            isCompleted,
            name,
            phoneNumber,
            rtSubscriptionId,
            updatedAt,
          };
        },
      ),
      householdsListUrl,
      householdsNumber,
      isCompleted,
      localOfficerName: `${lastName} ${middleName ?? ''} ${firstName}`,
      localOfficerUserId: localOfficerId,
      neccessariesList,
    };
  }

  private async getSubscription(id: string) {
    const subscription =
      await this.dbContext.localOfficerEventSubscription.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          amountOfMoney: true,
          createdAt: true,
          householdsNumber: true,
          householdsListUrl: true,
          updatedAt: true,
          isCompleted: true,
          neccessariesList: true,
          houseHolds: {
            select: {
              id: true,
              address: true,
              isCompleted: true,
              createdAt: true,
              updatedAt: true,
              name: true,
              phoneNumber: true,
              rtSubscriptionId: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
            },
          },
          localOfficer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              middleName: true,
            },
          },
        },
      });

    if (!subscription)
      throw new NotFoundException(
        'Không tìm thấy bài đăng ký cho sự kiện này.',
      );

    return subscription;
  }

  async execute(query: GetSubscriptionQuery): Promise<GetSubscriptionResponse> {
    const subscription = await this.getSubscription(query.subscriptionId);
    return this.map(subscription);
  }
}
