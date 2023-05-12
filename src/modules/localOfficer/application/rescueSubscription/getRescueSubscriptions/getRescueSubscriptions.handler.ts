import { PrismaService } from '@db';
import { ForbiddenException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventStatus, Prisma, UserType } from '@prisma/client';
import dayjs from 'dayjs';
import { Pagination } from '../../../../../common';
import { GetRescueSubscriptionsQuery } from './getRescueSubscriptions.query';
import {
  GetRescueSubscriptionsResponse,
  RescueSubscription,
} from './getRescueSubscriptions.response';

type GetRescueSubscription = Prisma.RescueTeamSubscriptionGetPayload<{
  select: {
    id: true;
    isApproved: true;
    isRejected: true;
    createdAt: true;
    rescueTeamUser: {
      select: {
        id: true;
        rescueTeamName: true;
        firstName: true;
        lastName: true;
        middleName: true;
      };
    };
  };
}>;

@QueryHandler(GetRescueSubscriptionsQuery)
export class GetRescueSubscriptionsHandler
  implements
    IQueryHandler<GetRescueSubscriptionsQuery, GetRescueSubscriptionsResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(subscription: GetRescueSubscription): RescueSubscription {
    const {
      createdAt,
      id,
      isApproved,
      isRejected,
      rescueTeamUser: {
        firstName,
        id: userId,
        lastName,
        middleName,
        rescueTeamName,
      },
    } = subscription;

    return {
      id,
      representative: `${lastName} ${middleName ?? ''} ${firstName}`,
      rescueTeamName,
      subscribeAt: dayjs(createdAt).toISOString(),
      rescueTeamUserId: userId,
      isApproved,
      isRejected,
    };
  }

  private async getRescueSubscriptions(userId: string) {
    const localOfficer = await this.dbContext.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (localOfficer?.userType !== UserType.LOCAL_OFFICER)
      throw new ForbiddenException(
        'Bạn không được phép thực hiện hành động này.',
      );

    const [total, rescueSubscriptions] = await Promise.all([
      this.dbContext.localOfficerEventSubscription.count({
        where: {
          isCompleted: false,
          isCanceled: false,
        },
      }),
      this.dbContext.rescueTeamSubscription.findMany({
        where: {
          loEventSubscription: {
            isCanceled: false,
            isCompleted: false,
            localOfficerUserId: userId,
            event: {
              status: EventStatus.OPEN,
            },
          },
          isApproved: false,
          isRejected: false,
        },
        select: {
          id: true,
          createdAt: true,
          isApproved: true,
          isRejected: true,
          rescueTeamUser: {
            select: {
              id: true,
              rescueTeamName: true,
              firstName: true,
              lastName: true,
              middleName: true,
            },
          },
        },
      }),
    ]);

    return {
      rescueSubscriptions,
      total,
    };
  }

  async execute(
    query: GetRescueSubscriptionsQuery,
  ): Promise<GetRescueSubscriptionsResponse> {
    const { rescueSubscriptions, total } = await this.getRescueSubscriptions(
      query.userId,
    );

    return Pagination.of(
      {},
      total,
      rescueSubscriptions?.map((rS) => this.map(rS)),
    ) as GetRescueSubscriptionsResponse;
  }
}
