import { PrismaService } from '@db';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetAllContentsQuery } from './getAllContents.query';
import {
  DistrictResponse,
  GetAllContentsResponse,
  ProvinceResponse,
  WardResponse,
} from './getAllContents.response';

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

type GetProvinceDto = Prisma.ProvinceGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
    nameWithType: true;
  };
}>;

@QueryHandler(GetAllContentsQuery)
export class GetAllContentsHandler
  implements IQueryHandler<GetAllContentsQuery, GetAllContentsResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private mapDistrict(district: GetDistrictDto): DistrictResponse {
    const { code, id, name, nameWithType, parentCode, path, pathWithType } =
      district;
    return { code, id, name, nameWithType, parentCode, path, pathWithType };
  }

  private mapWard(ward: GetWardDto): WardResponse {
    const { code, id, name, nameWithType, parentCode, path, pathWithType } =
      ward;
    return { code, id, name, nameWithType, parentCode, path, pathWithType };
  }

  private mapProvince(province: GetProvinceDto): ProvinceResponse {
    const { code, id, name, nameWithType } = province;
    return { code, id, name, nameWithType };
  }

  private async getAllContents() {
    const [provinces, wards, districts] = await Promise.all([
      this.dbContext.province.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          nameWithType: true,
        },
      }),
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

    return { districts, provinces, wards };
  }

  async execute(query: GetAllContentsQuery): Promise<GetAllContentsResponse> {
    const { districts, provinces, wards } = await this.getAllContents();

    return {
      districts: districts.map((d) => this.mapDistrict(d)),
      provinces: provinces.map((p) => this.mapProvince(p)),
      wards: wards.map((w) => this.mapWard(w)),
    } as GetAllContentsResponse;
  }
}
