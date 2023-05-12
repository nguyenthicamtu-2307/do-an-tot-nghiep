import { PrismaService } from '@db';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventStatus, UserType } from '@prisma/client';
import dayjs from 'dayjs';
import { PatchEventByAction } from '../event.enum';
import { PatchEventCommand } from './patchEvent.command';
import { PatchEventRequestBody } from './patchEvent.request-body';

@CommandHandler(PatchEventCommand)
export class PatchEventHandler
  implements ICommandHandler<PatchEventCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  async putEvent(body: PatchEventRequestBody, id: string, userId: string) {
    const user = await this.dbContext.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        userType: true,
      },
    });

    if (user?.userType !== UserType.ADMIN)
      throw new ForbiddenException(
        'Bạn không được phép thực hiện hành động này.',
      );

    const event = await this.dbContext.event.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!event) throw new NotFoundException('The event cannot be found.');

    const { action } = body;

    switch (action) {
      case PatchEventByAction.CLOSE:
        if (event.status === EventStatus.CLOSE)
          throw new BadRequestException('This event is currently closed.');
        await this.dbContext.event.update({
          where: {
            id,
          },
          data: {
            status: EventStatus.CLOSE,
            closedByAdminUserId: userId,
            closedAt: dayjs().toDate(),
          },
        });
        break;
      case PatchEventByAction.OPEN:
        if (event.status === EventStatus.OPEN)
          throw new BadRequestException('This event is currently opened.');
        await this.dbContext.event.update({
          where: {
            id,
          },
          data: {
            status: EventStatus.OPEN,
          },
        });
        break;
      case PatchEventByAction.PENDING:
        if (event.status === EventStatus.PENDING)
          throw new BadRequestException('This event is currently pending.');
        if (event.status === EventStatus.CLOSE)
          throw new BadRequestException(
            'Cannot move this event from CLOSE to PENDING',
          );
        await this.dbContext.event.update({
          where: {
            id,
          },
          data: {
            status: EventStatus.PENDING,
          },
        });
      default:
        break;
    }
  }

  async execute({ body, id, userId }: PatchEventCommand): Promise<void> {
    await this.putEvent(body, id, userId);
  }
}
