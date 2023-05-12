import { PrismaService } from '@db';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserType } from '@prisma/client';
import dayjs from 'dayjs';
import { PutEventCommand } from './putEvent.command';
import { PutEventRequestBody } from './putEvent.request-body';

@CommandHandler(PutEventCommand)
export class PutEventHandler implements ICommandHandler<PutEventCommand, void> {
  constructor(private readonly dbContext: PrismaService) {}

  async putEvent(body: PutEventRequestBody, id: string, userId: string) {
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
    });

    if (!event) throw new NotFoundException('Sự kiện không tồn tại.');

    const { name, type, endDate, description } = body;

    await this.dbContext.event.update({
      where: {
        id,
      },
      data: {
        name,
        type,
        endAt: dayjs(endDate).toDate(),
        description,
      },
    });
  }

  async execute({ body, id, userId }: PutEventCommand): Promise<void> {
    await this.putEvent(body, id, userId);
  }
}
