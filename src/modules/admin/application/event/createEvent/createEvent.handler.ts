import { PrismaService } from '@db';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserType } from '@prisma/client';
import dayjs from 'dayjs';
import { CreateEventCommand } from './createEvent.command';
import { CreateEventRequestBody } from './createEvent.request-body';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler
  implements ICommandHandler<CreateEventCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  async createEvent(body: CreateEventRequestBody, userId: string) {
    const user = await this.dbContext.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        userType: true,
      },
    });

    console.log(userId);

    if (user?.userType != UserType.ADMIN)
      throw new ForbiddenException(
        'Bạn không được phép thực hiện hành động này.',
      );

    const { name, startDate, type, endDate, description } = body;

    await this.dbContext.$transaction(async (trx) => {
      const foundEvent = await trx.event.findFirst({
        where: {
          name,
          type,
        },
      });

      if (foundEvent) throw new BadRequestException('Sự kiện này đã tồn tại.');

      return trx.event.create({
        data: {
          type,
          name,
          startAt: dayjs(startDate).toDate(),
          endAt: dayjs(endDate).toDate(),
          year: dayjs(startDate).year(),
          description,
          createdByAdminUserId: userId,
        },
      });
    });
  }

  async execute(command: CreateEventCommand): Promise<void> {
    await this.createEvent(command.body, command.requestUser.id);
  }
}
