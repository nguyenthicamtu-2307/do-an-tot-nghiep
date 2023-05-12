import { PrismaService } from '@db';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetAllContentsQuery } from './getAllWards.query';
import { GetAllWardsResponse, WardResponse } from './getAllWards.response';

type GetWardDto = Prisma.WardGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
    nameWithType: true;
    parentCode: true;
    path: true;
    pathWithType: true;
  };
}>;

@QueryHandler(GetAllContentsQuery)
export class GetAllWardsHandler
  implements IQueryHandler<GetAllContentsQuery, GetAllWardsResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private mapWard(ward: GetWardDto): WardResponse {
    const { code, id, name, nameWithType, parentCode, path, pathWithType } =
      ward;
    return { code, id, name, nameWithType, parentCode, path, pathWithType };
  }

  private async getAllContents() {
    const [wards] = await Promise.all([
      this.dbContext.ward.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          nameWithType: true,
          parentCode: true,
          path: true,
          pathWithType: true,
        },
      }),
    ]);

    return { wards };
  }

  async execute(query: GetAllContentsQuery): Promise<GetAllWardsResponse> {
    const { wards } = await this.getAllContents();

    return {
      wards: wards.map((w) => this.mapWard(w)),
    } as GetAllWardsResponse;
  }
}
