import { PrismaService } from '@db';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private dbContext: PrismaService) {}

  public async getAddressByWardId(wardId: string): Promise<string> {
    const ward = await this.dbContext.ward.findFirst({
      where: {
        id: wardId,
      },
      select: {
        path: true,
      },
    });

    if (!ward) throw new NotFoundException('Invalid address.');

    return ward.path;
  }
}
