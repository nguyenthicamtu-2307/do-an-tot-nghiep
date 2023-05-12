import { PrismaService } from '@db';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetAllDistrictsQuery } from './getAllDistricts.query';
import {
  DistrictResponse,
  GetAllDistrictsResponse,
} from './getAllDistricts.response';

type GetDistrictDto = Prisma.DistrictGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
    nameWithType: true;
    path: true;
    pathWithType: true;
    parentCode: true;
  };
}>;

@QueryHandler(GetAllDistrictsQuery)
export class GetAllDistrictsHandler
  implements IQueryHandler<GetAllDistrictsQuery, GetAllDistrictsResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private mapDistrict(district: GetDistrictDto): DistrictResponse {
    const { code, id, name, nameWithType, parentCode, path, pathWithType } =
      district;
    return { code, id, name, nameWithType, parentCode, path, pathWithType };
  }

  private async getAllContents() {
    const [districts] = await Promise.all([
      this.dbContext.district.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          nameWithType: true,
          path: true,
          pathWithType: true,
          parentCode: true,
        },
      }),
    ]);

    return { districts };
  }

  async execute(query: GetAllDistrictsQuery): Promise<GetAllDistrictsResponse> {
    const { districts } = await this.getAllContents();

    return {
      districts: districts.map((d) => this.mapDistrict(d)),
    } as GetAllDistrictsResponse;
  }
}
