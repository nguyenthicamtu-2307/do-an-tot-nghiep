import { PrismaService } from '@db';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { GetEventQuery } from './getEvent.query';
import { GetEventResponse } from './getEvent.response';

type GetEventDto = Prisma.EventGetPayload<{
  select: {
    id: true;
    type: true;
    name: true;
    startAt: true;
    endAt: true;
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

@QueryHandler(GetEventQuery)
export class GetEventHandler
  implements IQueryHandler<GetEventQuery, GetEventResponse>
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
      type,
      year,
    } = event;

    return {
      id,
      name,
      type,
      startDate: dayjs(startAt).toISOString(),
      endDate: dayjs(endAt).toISOString(),
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
      createdAt: dayjs(createdAt).toISOString(),
    };
  }

  async getEventById(id: string) {
    const event = await this.dbContext.event.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        type: true,
        name: true,
        startAt: true,
        endAt: true,
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
    });

    if (!event) throw new NotFoundException('Không tìm thấy sự kiện.');

    return event;
  }

  async execute(query: GetEventQuery): Promise<GetEventResponse> {
    const event = await this.getEventById(query.id);

    return this.map(event);
  }
}
