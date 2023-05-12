import { PrismaService } from '@db';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpsertWardCommand } from './upsertWard.command';

@CommandHandler(UpsertWardCommand)
export class UpsertWardHandler
  implements ICommandHandler<UpsertWardCommand, void>
{
  constructor(private readonly dbContext: PrismaService) {}

  async execute(command: UpsertWardCommand): Promise<void> {
    const data = command.data;

    Promise.all(
      data.map(
        async (ward) =>
          await this.dbContext.ward.upsert({
            where: {
              id: ward.id,
            },
            create: {
              ...ward,
            },
            update: {
              ...ward,
            },
          }),
      ),
    );
  }
}
