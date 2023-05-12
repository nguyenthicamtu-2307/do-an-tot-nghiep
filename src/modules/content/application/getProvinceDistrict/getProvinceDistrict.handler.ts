import { PrismaService } from '@db';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetProvinceDistrictQuery } from './getProvinceDistrict.query';
import {
  DistrictResponse,
  GetProvinceDistrictResponse,
} from './getProvinceDistrict.response';

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

@QueryHandler(GetProvinceDistrictQuery)
export class GetProvinceDistrictsHandler
  implements
    IQueryHandler<GetProvinceDistrictQuery, GetProvinceDistrictResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private mapDistrict(district: GetDistrictDto): DistrictResponse {
    const { code, id, name, nameWithType, parentCode, path, pathWithType } =
      district;
    return { code, id, name, nameWithType, parentCode, path, pathWithType };
  }

  private async getDistrictsByProvinceId(id: string) {
    const province = await this.dbContext.province.findUnique({
      where: {
        id,
      },
    });

    const districts = await this.dbContext.district.findMany({
      where: {
        parentCode: province!.code,
      },
    });

    return districts;
  }

  async execute(
    query: GetProvinceDistrictQuery,
  ): Promise<GetProvinceDistrictResponse> {
    const districts = await this.getDistrictsByProvinceId(query.id);

    return {
      districts: districts.map((d) => this.mapDistrict(d)),
    } as GetProvinceDistrictResponse;
  }
}
