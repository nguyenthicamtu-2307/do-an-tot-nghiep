import { PrismaService } from '@db';
import { ForbiddenException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { Pagination, filterOperationByMode } from '../../../../../common';
import { GetEventsOrderByEnum } from '../eventSubscription.enum';
import { GetEventsQuery } from './getEvents.query';
import { GetEventsRequestQuery } from './getEvents.request-query';
import { EventResponse, GetEventsResponse } from './getEvents.response';

type GetEventDto = Prisma.EventGetPayload<{
  select: {
    id: true;
    name: true;
    type: true;
    startAt: true;
    endAt: true;
    createdAt: true;
    year: true;
    closedAt: true;
    status: true;
    lOEventSubscriptions: {
      select: {
        id: true;
        localOfficerUserId: true;
      };
    };
  };
}>;

@QueryHandler(GetEventsQuery)
export class GetEventsWithSubscriptionHandler
  implements IQueryHandler<GetEventsQuery, GetEventsResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(event: GetEventDto, userId: string): EventResponse {
    const {
      closedAt,
      createdAt,
      endAt,
      id,
      lOEventSubscriptions,
      name,
      startAt,
      status,
      type,
      year,
    } = event;

    const eventSubscription = lOEventSubscriptions.filter(
      (subscription) => subscription.localOfficerUserId === userId,
    );

    return {
      closedAt,
      createdAt,
      endAt,
      eventType: type,
      year,
      startAt,
      status,
      id,
      name,
      eventSubscriptionId:
        eventSubscription?.length > 0 ? eventSubscription[0].id : null,
    };
  }

  private async getEventsWithSubscription(
    option: GetEventsRequestQuery,
    userId: string,
  ) {
    const localOfficer = await this.dbContext.user.findFirst({
      where: {
        id: userId,
        isCurrentLocalOfficer: true,
      },
    });

    if (!localOfficer)
      throw new ForbiddenException(
        'Bạn không được phép thực hiện hành động này.',
      );

    const {
      from,
      isSubscribed,
      name,
      order,
      skip = 0,
      statuses,
      take = 10,
      to,
      types,
      year,
    } = option;

    let andWhereConditions: Prisma.Enumerable<Prisma.EventWhereInput> = [];
    let orderBy = {};

    if (year) {
      andWhereConditions = [...andWhereConditions, { year }];
    }

    if (types && types.length > 0) {
      andWhereConditions = [...andWhereConditions, { type: { in: types } }];
    }

    if (statuses && statuses.length > 0) {
      andWhereConditions = [
        ...andWhereConditions,
        { status: { in: statuses } },
      ];
    }

    if (name) {
      andWhereConditions = [
        ...andWhereConditions,
        { name: filterOperationByMode(name) },
      ];
    }

    if (from) {
      andWhereConditions = [
        ...andWhereConditions,
        { startAt: { gte: dayjs(from).toDate() } },
      ];
    }

    if (to) {
      andWhereConditions = [
        ...andWhereConditions,
        {
          startAt: {
            lte: dayjs(to).toDate(),
          },
        },
      ];
    }

    if (isSubscribed) {
      andWhereConditions = [
        ...andWhereConditions,
        {
          lOEventSubscriptions: {
            some: {
              localOfficerUserId: userId,
            },
          },
        },
      ];
    }

    if (order) {
      const [field, direction] = order.split(':');

      switch (field) {
        case GetEventsOrderByEnum.END_AT:
          orderBy = {
            endAt: direction,
          };
          break;
        case GetEventsOrderByEnum.EVENT_TYPE:
          orderBy = {
            type: direction,
          };
          break;
        case GetEventsOrderByEnum.NAME:
          orderBy = {
            name: direction,
          };
          break;
        case GetEventsOrderByEnum.START_AT:
          orderBy = {
            startAt: direction,
          };
          break;
        case GetEventsOrderByEnum.STATUS:
          orderBy = {
            status: direction,
          };
          break;
        default:
          orderBy = {
            startAt: Prisma.SortOrder.asc,
          };
          break;
      }
    } else {
      orderBy = {
        startAt: Prisma.SortOrder.asc,
      };
    }

    const countOperation = {
      where: {
        AND: andWhereConditions,
      },
    };

    const [total, events] = await Promise.all([
      this.dbContext.event.count(countOperation),
      this.dbContext.event.findMany({
        where: {
          AND: andWhereConditions,
        },
        skip,
        take,
        select: {
          id: true,
          name: true,
          type: true,
          startAt: true,
          endAt: true,
          createdAt: true,
          year: true,
          closedAt: true,
          status: true,
          lOEventSubscriptions: {
            select: {
              id: true,
              localOfficerUserId: true,
            },
          },
        },
        orderBy,
      }),
    ]);

    return { total, events };
  }

  async execute(query: GetEventsQuery): Promise<GetEventsResponse> {
    const { events, total } = await this.getEventsWithSubscription(
      query.option,
      query.userId,
    );

    return Pagination.of(
      {},
      total,
      events.map((event) => this.map(event, query.userId)),
    ) as GetEventsResponse;
  }
}
