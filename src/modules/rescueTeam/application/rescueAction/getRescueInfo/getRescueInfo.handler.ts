import { PrismaService } from '@db';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { GetRescueInfoQuery } from './getRescueInfo.query';
import { GetRescueInfoResponse } from './getRescueInfo.response';

type GetRescueSubscriptionDto = Prisma.RescueTeamSubscriptionGetPayload<{
  select: {
    id: true;
    isApproved: true;
    createdAt: true;
    loEventSubscription: {
      select: {
        householdsNumber: true;
        localOfficer: {
          select: {
            localOfficeWard: {
              select: {
                pathWithType: true;
              };
            };
          };
        };
        event: {
          select: {
            name: true;
            closedAt: true;
          };
        };
        householdsListUrl: true;
        houseHolds: {
          select: {
            address: true;
            createdAt: true;
            id: true;
            isCompleted: true;
            name: true;
            phoneNumber: true;
            updatedAt: true;
          };
        };
      };
    };
  };
}>;

@QueryHandler(GetRescueInfoQuery)
export class GetRescueInfoHandler
  implements IQueryHandler<GetRescueInfoQuery, GetRescueInfoResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(rescueInfo: GetRescueSubscriptionDto): GetRescueInfoResponse {
    const {
      createdAt,
      id,
      isApproved,
      loEventSubscription: {
        event,
        houseHolds,
        householdsListUrl,
        householdsNumber,
        localOfficer,
      },
    } = rescueInfo;

    return {
      id,
      closedAt: dayjs(event.closedAt).toISOString(),
      eventName: event.name,
      householdNumber: householdsNumber,
      houseHolds,
      householdsListUrl,
      path: localOfficer.localOfficeWard?.pathWithType ?? '',
      subscribeAt: dayjs(createdAt).toISOString(),
      isApproved,
    };
  }

  private async getRescueInfo(id: string) {
    const rescueSubscription =
      await this.dbContext.rescueTeamSubscription.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          isApproved: true,
          createdAt: true,
          loEventSubscription: {
            select: {
              householdsNumber: true,
              localOfficer: {
                select: {
                  localOfficeWard: {
                    select: {
                      pathWithType: true,
                    },
                  },
                },
              },
              event: {
                select: {
                  name: true,
                  closedAt: true,
                },
              },
              householdsListUrl: true,
              houseHolds: {
                select: {
                  address: true,
                  createdAt: true,
                  id: true,
                  isCompleted: true,
                  name: true,
                  phoneNumber: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
      });

    if (!rescueSubscription)
      throw new NotFoundException('Yêu cầu cứu trợ không tồn tại.');

    if (!rescueSubscription.isApproved)
      throw new BadRequestException('Yêu cầu cứu trợ chưa được chấp nhận.');

    return rescueSubscription;
  }

  async execute(query: GetRescueInfoQuery): Promise<GetRescueInfoResponse> {
    const rescueInfo = await this.getRescueInfo(query.rescueSubscriptionId);

    return this.map(rescueInfo);
  }
}
