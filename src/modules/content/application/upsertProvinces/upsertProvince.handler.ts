import { PrismaService } from '@db';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpsertProvinceCommand } from './upsertProvince.command';

@CommandHandler(UpsertProvinceCommand)
export class UpsertProvinceHandler
  implements ICommandHandler<UpsertProvinceCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  async execute(command: UpsertProvinceCommand): Promise<void> {
    const data = command.data;

    await this.dbContext.$transaction(async (trx) =>
      Promise.all(
        data.map(
          async (province) =>
            await trx.province.upsert({
              where: {
                id: province.id,
              },
              create: {
                ...province,
              },
              update: {
                ...province,
              },
            }),
        ),
      ),
    );
  }
}
