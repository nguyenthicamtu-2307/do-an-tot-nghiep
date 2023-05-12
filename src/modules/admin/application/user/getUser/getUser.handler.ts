import { PrismaService } from '@db';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetUserQuery } from './getUser.query';
import { GetUserResponse } from './getUser.response';

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
    bankName: true;
    bankAccountNumber: true;
    isSuperAdmin: true;
    localOfficerDistrictId: true;
    localOfficerProvinceId: true;
    isCurrentLocalOfficer: true;
    localOfficerWardId: true;
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

@QueryHandler(GetUserQuery)
export class GetUserHandler
  implements IQueryHandler<GetUserQuery, GetUserResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(user: GetUserDto): GetUserResponse {
    const {
      email,
      firstName,
      id,
      lastName,
      middleName,
      phoneNumber,
      status,
      userType,
      ward: { path },
      avatarUrl,
      bankAccountNumber,
      bankName,
      isSuperAdmin,
      isCurrentLocalOfficer,
      localOfficerDistrictId,
      localOfficerProvinceId,
      localOfficerWardId,
      rescueTeamName,
      localOfficeWard,
    } = user;

    return {
      id,
      address: path,
      email,
      phoneNumber,
      userStatus: status,
      userType: userType,
      fullName: `${lastName} ${middleName ?? ''} ${firstName}`,
      avatarUrl,
      bankAccountNumber,
      isCurrentLocalOfficer,
      bankName,
      isSuperAdmin,
      localOfficeAddress: localOfficeWard ? localOfficeWard.path : null,
      localOfficeDistrictId: localOfficerDistrictId,
      localOfficeProvinceId: localOfficerProvinceId,
      localOfficeWardId: localOfficerWardId,
      rescueTeamName,
    };
  }

  private async getUser(id: string) {
    const user = await this.dbContext.user.findFirst({
      where: {
        id,
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
        bankName: true,
        bankAccountNumber: true,
        isSuperAdmin: true,
        localOfficerDistrictId: true,
        localOfficerProvinceId: true,
        localOfficerWardId: true,
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
        isCurrentLocalOfficer: true,
      },
    });

    if (!user) throw new NotFoundException('The user cannot be found.');

    return user;
  }

  async execute({ id }: GetUserQuery): Promise<GetUserResponse> {
    const user = await this.getUser(id);

    return this.map(user);
  }
}
