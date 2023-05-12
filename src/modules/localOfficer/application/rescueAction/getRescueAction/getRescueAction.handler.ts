import { PrismaService } from '@db';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LocalOfficerEventSubscription, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { GetRescueActionQuery } from './getRescueAction.query';
import { GetRescueActionResponse } from './getRescueAction.response';

type RescueTeamSubscriptionDto = Prisma.RescueTeamSubscriptionGetPayload<{
  include: {
    rescueTeamUser: true;
    reliefPlan: {
      include: {
        aidPackage: {
          include: {
            neccessaries: true;
          };
        };
      };
    };
    donationPost: {
      include: {
        donationNeccessaries: {
          include: {
            reliefNeccessary: true;
          };
        };
      };
    };
  };
}>;

@QueryHandler(GetRescueActionQuery)
export class GetRescueActionHandler
  implements IQueryHandler<GetRescueActionQuery, GetRescueActionResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(
    subscription: LocalOfficerEventSubscription,
    rescueTeamSubscription: RescueTeamSubscriptionDto | null,
  ): GetRescueActionResponse {
    const {
      amountOfMoney,
      createdAt,
      householdsListUrl,
      id,
      neccessariesList,
    } = subscription;

    return {
      amountOfMoney,
      createdAt: dayjs(createdAt).toISOString(),
      id,
      neccessariesList,
      householdsListUrl,
      donationPost: rescueTeamSubscription?.donationPost
        ? {
            deadline: dayjs(
              rescueTeamSubscription.donationPost.deadline,
            ).toISOString(),
            donatedMoney: rescueTeamSubscription.donationPost.donatedMoney,
            id: rescueTeamSubscription.donationPost.id,
            moneyNeed: rescueTeamSubscription.donationPost.moneyNeed,
            status: rescueTeamSubscription.donationPost.status,
            neccessaries:
              rescueTeamSubscription.donationPost.donationNeccessaries.length >
              0
                ? rescueTeamSubscription.donationPost.donationNeccessaries.map(
                    (nec) => {
                      return {
                        donatedQuantity: nec.donatedQuantity,
                        name: nec.reliefNeccessary.name,
                        quantity: nec.quantity,
                      };
                    },
                  )
                : [],
          }
        : null,
      reliefPlan: rescueTeamSubscription?.reliefPlan
        ? {
            aidPackage: rescueTeamSubscription.reliefPlan.aidPackage
              ? {
                  amountOfMoney:
                    rescueTeamSubscription.reliefPlan.aidPackage.amountOfMoney,
                  neccessaries:
                    rescueTeamSubscription.reliefPlan.aidPackage.neccessaries,
                  neccessariesList:
                    rescueTeamSubscription.reliefPlan.aidPackage
                      .neccessariesList,
                  totalValue:
                    rescueTeamSubscription.reliefPlan.aidPackage.totalValue,
                }
              : null,
            endAt: dayjs(rescueTeamSubscription.reliefPlan.endAt).toISOString(),
            id: rescueTeamSubscription.reliefPlan.id,
            originalnoney: rescueTeamSubscription.originalnoney,
            startAt: dayjs(
              rescueTeamSubscription.reliefPlan.startAt,
            ).toISOString(),
          }
        : null,
      rescueTeamName: rescueTeamSubscription?.rescueTeamUser
        ? rescueTeamSubscription.rescueTeamUser.rescueTeamName
        : null,
      rescueTeamUserId: rescueTeamSubscription?.rescueTeamUserId ?? null,
    };
  }

  private async getRescueAction(subscriptionId: string) {
    const subscription =
      await this.dbContext.localOfficerEventSubscription.findUnique({
        where: {
          id: subscriptionId,
        },
      });

    if (!subscription) throw new NotFoundException('Bạn chưa đăng ký sự kiện');

    const rescueTeamSubscription =
      await this.dbContext.rescueTeamSubscription.findFirst({
        where: {
          loEventSubscriptionId: subscriptionId,
          isApproved: true,
        },
        include: {
          rescueTeamUser: true,
          reliefPlan: {
            include: {
              aidPackage: {
                include: {
                  neccessaries: true,
                },
              },
            },
          },
          donationPost: {
            include: {
              donationNeccessaries: {
                include: {
                  reliefNeccessary: true,
                },
              },
            },
          },
        },
      });

    return { subscription, rescueTeamSubscription };
  }

  async execute({
    subscriptionId,
  }: GetRescueActionQuery): Promise<GetRescueActionResponse> {
    const { rescueTeamSubscription, subscription } = await this.getRescueAction(
      subscriptionId,
    );

    return this.map(subscription, rescueTeamSubscription);
  }
}
