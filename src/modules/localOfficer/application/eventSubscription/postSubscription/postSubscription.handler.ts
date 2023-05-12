import { PrismaService } from '@db';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventStatus, UserType } from '@prisma/client';
import dayjs from 'dayjs';
import { PostSubscriptionCommand } from './postSubscription.command';

@CommandHandler(PostSubscriptionCommand)
export class PostSubscriptionHandler
  implements ICommandHandler<PostSubscriptionCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  private async postSubscription(
    userId: string,
    eventId: string,
    householdNumber: number,
  ) {
    const user = await this.dbContext.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        userType: true,
        localOfficerDistrictId: true,
        localOfficerProvinceId: true,
        localOfficerWardId: true,
        isCurrentLocalOfficer: true,
      },
    });

    if (user?.userType !== UserType.LOCAL_OFFICER)
      throw new ForbiddenException(
        'Bạn không được phép thực hiện hành động này.',
      );

    if (!user.isCurrentLocalOfficer)
      throw new ForbiddenException(
        'Bạn không phải là cán bộ của địa phương hiện tại.',
      );

    await this.dbContext.$transaction(async (trx) => {
      const event = await trx.event.findUnique({
        where: {
          id: eventId,
        },
        select: {
          startAt: true,
          endAt: true,
          status: true,
        },
      });

      if (!event) throw new NotFoundException('Sự kiện không tồn tại.');

      if (event.status === EventStatus.PENDING)
        throw new BadRequestException('Sự kiện vẫn chưa diễn ra.');

      if (dayjs(event.startAt).isAfter(dayjs()))
        throw new BadRequestException(
          `Sự kiện sẽ bắt đầu vào ngày ${dayjs(event.startAt).format(
            'DD/MM/YYYY',
          )}. Vui lòng quay lại sau.`,
        );

      if (dayjs(event.endAt).isBefore(dayjs()))
        throw new BadRequestException(
          `Sự kiện đã kết thúc vào ngày ${dayjs(event.endAt).format(
            'DD/MM/YYYY',
          )}.`,
        );

      const foundSubscription =
        await trx.localOfficerEventSubscription.findFirst({
          where: {
            eventId,
            localOfficerUserId: userId,
          },
          select: {
            id: true,
            isCompleted: true,
            isCanceled: true,
          },
        });

      if (!foundSubscription) {
        await trx.event.update({
          where: {
            id: eventId,
          },
          data: {
            lOEventSubscriptions: {
              create: {
                householdsNumber: householdNumber,
                localOfficer: {
                  connect: {
                    id: userId,
                  },
                },
              },
            },
          },
        });
        return;
      }

      if (foundSubscription.isCompleted)
        throw new BadRequestException('Đã hoàn thành cứu trợ cho sự kiện này.');

      if (foundSubscription.isCanceled) {
        await trx.localOfficerEventSubscription.update({
          where: {
            id: foundSubscription.id,
          },
          data: {
            isCanceled: false,
          },
        });
        return;
      } else {
        throw new BadRequestException('Sự kiện này đã được đăng ký cứu trợ.');
      }
    });
  }

  async execute({
    householdNumber,
    eventId,
    userId,
  }: PostSubscriptionCommand): Promise<void> {
    return this.postSubscription(userId, eventId, householdNumber);
  }
}
