import { Pagination, filterOperationByMode } from '@common';
import { PrismaService } from '@db';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma, UserType } from '@prisma/client';
import { GetUsersOrderByEnum } from '../user.enum';
import { GetLocalOfficerUserQuery } from './getLocalOfficers.query';
import { GetLocalOfficersRequestQuery } from './getLocalOfficers.request-query';
import {
  GetLocalOfficersResponse,
  LocalOfficerResponse,
} from './getLocalOfficers.response';

type GetUserDto = Prisma.UserGetPayload<{
  select: {
    id: true;
    status: true;
    userType: true;
    firstName: true;
    middleName: true;
    lastName: true;
    email: true;
    phoneNumber: true;
    avatarUrl: true;
    isCurrentLocalOfficer: true;
    rescueTeamName: true;
    ward: {
      select: {
        path: true;
      };
    };
    localOfficeWard: {
      select: {
        path: true;
      };
    };
  };
}>;

@QueryHandler(GetLocalOfficerUserQuery)
export class GetLocalOfficersHandler
  implements IQueryHandler<GetLocalOfficerUserQuery, GetLocalOfficersResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(user: GetUserDto): LocalOfficerResponse {
    const {
      email,
      firstName,
      id,
      lastName,
      middleName,
      phoneNumber,
      status,
      ward: { path },
      avatarUrl,
      isCurrentLocalOfficer,
      localOfficeWard,
    } = user;

    return {
      id,
      address: path,
      email,
      phoneNumber,
      userStatus: status,
      fullName: `${lastName} ${middleName ?? ''} ${firstName}`,
      avatarUrl,
      isCurrentLocalOfficer,
      localOfficeAddress: localOfficeWard ? localOfficeWard.path : null,
    };
  }

  private async getLocalOfficers(option: GetLocalOfficersRequestQuery) {
    const {
      districtId,
      order,
      provinceId,
      search,
      skip = 0,
      status,
      take = 10,
      wardId,
    } = option;

    let andWhereConditions: Prisma.Enumerable<Prisma.UserWhereInput> = [
      { userType: UserType.LOCAL_OFFICER },
    ];

    if (districtId)
      andWhereConditions = [
        ...andWhereConditions,
        { localOfficerDistrictId: districtId },
      ];

    if (provinceId)
      andWhereConditions = [
        ...andWhereConditions,
        { localOfficerProvinceId: provinceId },
      ];

    if (wardId)
      andWhereConditions = [
        ...andWhereConditions,
        { localOfficerWardId: wardId },
      ];

    if (status && status?.length > 0) {
      andWhereConditions = [
        ...andWhereConditions,
        {
          status: {
            in: status,
          },
        },
      ];
    }

    if (search) {
      andWhereConditions = [
        ...andWhereConditions,
        {
          OR: [
            { phoneNumber: filterOperationByMode(search) },
            { email: filterOperationByMode(search) },
          ],
        },
      ];
    }

    let orderBy = {};

    if (order) {
      const [field, direction] = order.split(':');

      switch (field) {
        case GetUsersOrderByEnum.EMAIL:
          orderBy = {
            email: direction,
          };
          break;
        case GetUsersOrderByEnum.FIRST_NAME:
          orderBy = {
            firstName: direction,
          };
          break;
        case GetUsersOrderByEnum.PHONE_NUMBER:
          orderBy = {
            phoneNumber: direction,
          };
        default:
          orderBy = {
            firstName: Prisma.SortOrder.asc,
          };
          break;
      }
    } else {
      orderBy = {
        firstName: Prisma.SortOrder.asc,
      };
    }

    const countOperation = {
      where: {
        AND: andWhereConditions,
      },
    };

    const [total, localOfficers] = await Promise.all([
      await this.dbContext.user.count(countOperation),
      await this.dbContext.user.findMany({
        where: {
          AND: andWhereConditions,
        },
        select: {
          id: true,
          status: true,
          userType: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          avatarUrl: true,
          isCurrentLocalOfficer: true,
          rescueTeamName: true,
          ward: {
            select: {
              path: true,
            },
          },
          localOfficeWard: {
            select: {
              path: true,
            },
          },
        },
        skip,
        take,
        orderBy,
      }),
    ]);

    return { localOfficers, total };
  }

  async execute({
    option,
  }: GetLocalOfficerUserQuery): Promise<GetLocalOfficersResponse> {
    const { localOfficers, total } = await this.getLocalOfficers(option);

    return Pagination.of(
      {},
      total,
      localOfficers.map((lo) => this.map(lo)),
    ) as GetLocalOfficersResponse;
  }
}
