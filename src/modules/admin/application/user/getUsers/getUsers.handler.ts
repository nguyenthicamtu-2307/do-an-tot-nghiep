import { filterOperationByMode, Pagination } from '@common';
import { PrismaService } from '@db';
import { ForbiddenException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma, UserType } from '@prisma/client';
import { GetUsersOrderByEnum } from '../user.enum';
import { GetUsersQuery } from './getUsers.query';
import { GetUsersRequestQuery } from './getUsers.request-query';
import { GetUsersResponse, UserResponse } from './getUsers.response';

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
    ward: {
      select: {
        path: true;
      };
    };
  };
}>;

@QueryHandler(GetUsersQuery)
export class GetUsersHandler
  implements IQueryHandler<GetUsersQuery, GetUsersResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(user: GetUserDto): UserResponse {
    const {
      firstName,
      id,
      lastName,
      middleName,
      status,
      userType,
      email,
      phoneNumber,
      ward: { path },
    } = user;

    return {
      id,
      address: path,
      email,
      phoneNumber,
      userStatus: status,
      userType: userType,
      fullName: `${lastName} ${middleName ?? ''} ${firstName}`,
    };
  }

  private async getUsers(option: GetUsersRequestQuery, userId: string) {
    const user = await this.dbContext.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        userType: true,
      },
    });

    if (user?.userType !== UserType.ADMIN)
      throw new ForbiddenException(
        'Bạn không được phép thực hiện hành động này.',
      );

    const {
      districtId,
      order,
      provinceId,
      search,
      skip = 0,
      take = 10,
      types,
      status,
      wardId,
    } = option;

    let andWhereConditions: Prisma.Enumerable<Prisma.UserWhereInput> = [];

    if (districtId)
      andWhereConditions = [...andWhereConditions, { districtId }];

    if (provinceId)
      andWhereConditions = [...andWhereConditions, { provinceId }];

    if (wardId) andWhereConditions = [...andWhereConditions, { wardId }];

    if (types && types?.length > 0) {
      andWhereConditions = [
        ...andWhereConditions,
        {
          userType: {
            in: types,
          },
        },
      ];
    }

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

    const [total, users] = await Promise.all([
      this.dbContext.user.count(countOperation),
      this.dbContext.user.findMany({
        where: {
          AND: andWhereConditions,
        },
        skip,
        take,
        select: {
          id: true,
          status: true,
          userType: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          ward: {
            select: {
              path: true,
            },
          },
        },
        orderBy,
      }),
    ]);

    return { total, users };
  }

  async execute({ option, userId }: GetUsersQuery): Promise<GetUsersResponse> {
    const { total, users } = await this.getUsers(option, userId);

    return Pagination.of(
      {},
      total,
      users.map((user) => this.map(user)),
    ) as GetUsersResponse;
  }
}
