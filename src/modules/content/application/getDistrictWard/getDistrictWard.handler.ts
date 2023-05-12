import { PrismaService } from '@db';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetDistrictWardQuery } from './getDistrictWard.query';
import {
  GetDistrictWardsResponse,
  WardResponse,
} from './getDistrictWard.response';

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

@QueryHandler(GetDistrictWardQuery)
export class GetDistrictWardsHandler
  implements IQueryHandler<GetDistrictWardQuery, GetDistrictWardsResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private mapWard(ward: GetWardDto): WardResponse {
    const { code, id, name, nameWithType, parentCode, path, pathWithType } =
      ward;
    return { code, id, name, nameWithType, parentCode, path, pathWithType };
  }

  private async getWardByDistrictId(id: string) {
    const district = await this.dbContext.district.findUnique({
      where: {
        id,
      },
      select: {
        code: true,
      },
    });

    const wards = await this.dbContext.ward.findMany({
      where: {
        parentCode: district!.code,
      },
    });

    return wards;
  }

  async execute(
    query: GetDistrictWardQuery,
  ): Promise<GetDistrictWardsResponse> {
    const wards = await this.getWardByDistrictId(query.id);

    return {
      wards: wards.map((w) => this.mapWard(w)),
    } as GetDistrictWardsResponse;
  }
}
