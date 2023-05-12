import { PrismaService } from '@db';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetAllProvincesQuery } from './getAllProvinces.query';
import {
  GetAllProvincesResponse,
  ProvinceResponse,
} from './getAllProvinces.response';

type GetProvinceDto = Prisma.ProvinceGetPayload<{
  select: {
    id: true;
    code: true;
    name: true;
    nameWithType: true;
  };
}>;

@QueryHandler(GetAllProvincesQuery)
export class GetAllProvincesHandler
  implements IQueryHandler<GetAllProvincesQuery, GetAllProvincesResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private mapProvince(province: GetProvinceDto): ProvinceResponse {
    const { code, id, name, nameWithType } = province;
    return { code, id, name, nameWithType };
  }

  private async getAllContents() {
    const [provinces] = await Promise.all([
      this.dbContext.province.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          nameWithType: true,
        },
      }),
    ]);

    return { provinces };
  }

  async execute(query: GetAllProvincesQuery): Promise<GetAllProvincesResponse> {
    const { provinces } = await this.getAllContents();

    return {
      provinces: provinces.map((p) => this.mapProvince(p)),
    } as GetAllProvincesResponse;
  }
}
