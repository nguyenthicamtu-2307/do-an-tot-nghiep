import { filterOperationByMode, Pagination } from '@common';
import { PrismaService } from '@db';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { GetEventsOrderByEnum } from '../rescueSubscription.enum';
import { GetEventsQuery } from './getEvents.query';
import { GetEventsRequestQuery } from './getEvents.request-query';
import { GetEventResponse, GetEventsResponse } from './getEvents.response';

type GetEventDto = Prisma.EventGetPayload<{
  select: {
    id: true;
    type: true;
    name: true;
    startAt: true;
    endAt: true;
    closedAt: true;
    createdBy: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        middleName: true;
      };
    };
    closedBy: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        middleName: true;
      };
    };
    year: true;
    status: true;
    description: true;
    createdAt: true;
  };
}>;

@QueryHandler(GetEventsQuery)
export class GetEventsHandler
  implements IQueryHandler<GetEventsQuery, GetEventsResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(event: GetEventDto): GetEventResponse {
    const {
      closedBy,
      createdAt,
      createdBy,
      description,
      endAt,
      id,
      name,
      startAt,
      status,
      closedAt,
      type,
      year,
    } = event;

    return {
      id,
      name,
      closedAt,
      type,
      startAt,
      endAt,
      description,
      createdBy: {
        id: createdBy.id,
        fullName: `${createdBy.lastName} ${createdBy.middleName} ${createdBy.firstName}`,
      },
      closedBy: closedBy
        ? {
            id: closedBy.id,
            fullName: `${closedBy.lastName} ${closedBy.middleName} ${closedBy.firstName}`,
          }
        : null,
      status,
      year,
      createdAt,
    };
  }

  private async getEvents(option: GetEventsRequestQuery) {
    const {
      creatingAdminUserId,
      closingAdminUserId,
      name,
      order,
      skip = 0,
      statuses,
      take = 10,
      types,
      year,
      from,
      to,
    } = option;

    let andWhereConditions: Prisma.Enumerable<Prisma.EventWhereInput> = [];

    let orderBy = {};

    if (year)
      andWhereConditions = [
        ...andWhereConditions,
        {
          year,
        },
      ];

    if (types && types.length > 0) {
      andWhereConditions = [
        ...andWhereConditions,
        {
          type: {
            in: types,
          },
        },
      ];
    }

    if (statuses && statuses?.length > 0)
      andWhereConditions = [
        ...andWhereConditions,
        {
          status: {
            in: statuses,
          },
        },
      ];

    if (name)
      andWhereConditions = [
        ...andWhereConditions,
        {
          name: filterOperationByMode(name),
        },
      ];

    if (creatingAdminUserId)
      andWhereConditions = [
        ...andWhereConditions,
        {
          createdByAdminUserId: creatingAdminUserId,
        },
      ];

    if (closingAdminUserId)
      andWhereConditions = [
        ...andWhereConditions,
        {
          closedByAdminUserId: closingAdminUserId,
        },
      ];

    if (from)
      andWhereConditions = [
        ...andWhereConditions,
        {
          startAt: {
            gte: dayjs(from).toDate(),
          },
        },
      ];

    if (to)
      andWhereConditions = [
        ...andWhereConditions,
        {
          startAt: {
            lte: dayjs(to).toDate(),
          },
        },
      ];

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
        case GetEventsOrderByEnum.YEAR:
          orderBy = {
            year: direction,
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
          type: true,
          name: true,
          startAt: true,
          endAt: true,
          closedAt: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              middleName: true,
            },
          },
          closedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              middleName: true,
            },
          },
          year: true,
          status: true,
          description: true,
          createdAt: true,
        },
        orderBy,
      }),
    ]);

    return { total, events };
  }

  async execute(query: GetEventsQuery): Promise<GetEventsResponse> {
    const { events, total } = await this.getEvents(query.option);

    return Pagination.of(
      {},
      total,
      events.map((event) => this.map(event)),
    ) as GetEventsResponse;
  }
}
