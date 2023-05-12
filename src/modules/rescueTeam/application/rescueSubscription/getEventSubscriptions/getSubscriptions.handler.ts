import { PrismaService } from '@db';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetSubscriptionsQuery } from './getSubscriptions.query';
import {
  GetSubscriptionsResponse,
  LoEventSubscriptionResponse,
} from './getSubscriptions.response';

type GetSubscriptionDto = Prisma.LocalOfficerEventSubscriptionGetPayload<{
  select: {
    id: true;
    householdsNumber: true;
    localOfficer: {
      select: {
        localOfficeWard: {
          select: {
            path: true;
          };
        };
      };
    };
  };
}>;

@QueryHandler(GetSubscriptionsQuery)
export class GetSubscriptionsHandler
  implements IQueryHandler<GetSubscriptionsQuery, GetSubscriptionsResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(subscription: GetSubscriptionDto): LoEventSubscriptionResponse {
    const { householdsNumber, id, localOfficer } = subscription;

    return {
      id,
      householdsNumber,
      path: localOfficer.localOfficeWard
        ? localOfficer.localOfficeWard.path
        : '',
    };
  }

  private async getSubscriptions(eventId: string, userId: string) {
    const subscriptions =
      await this.dbContext.localOfficerEventSubscription.findMany({
        where: {
          eventId,
          rescueTeamSubscriptions: {
            none: {
              rescueTeamUserId: userId,
            },
          },
          isCanceled: false,
          isCompleted: false,
        },
        select: {
          id: true,
          householdsNumber: true,
          localOfficer: {
            select: {
              localOfficeWard: {
                select: {
                  path: true,
                },
              },
            },
          },
        },
      });

    return subscriptions;
  }

  async execute({
    eventId,
    userId,
  }: GetSubscriptionsQuery): Promise<GetSubscriptionsResponse> {
    const subscriptions = await this.getSubscriptions(eventId, userId);

    return {
      loEventSubscriptions: subscriptions.map((sub) => this.map(sub)),
    } as GetSubscriptionsResponse;
  }
}
