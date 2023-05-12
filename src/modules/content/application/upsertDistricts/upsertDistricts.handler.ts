import { PrismaService } from '@db';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpsertDistrictCommand } from './upsertDistrict.command';

@CommandHandler(UpsertDistrictCommand)
export class UpsertDistrictHandler
  implements ICommandHandler<UpsertDistrictCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  async execute(command: UpsertDistrictCommand): Promise<void> {
    const data = command.data;

    await this.dbContext.$transaction(async (trx) =>
      Promise.all(
        data.map(
          async (district) =>
            await trx.district.upsert({
              where: {
                id: district.id,
              },
              create: {
                ...district,
              },
              update: {
                ...district,
              },
            }),
        ),
      ),
    );
  }
}
