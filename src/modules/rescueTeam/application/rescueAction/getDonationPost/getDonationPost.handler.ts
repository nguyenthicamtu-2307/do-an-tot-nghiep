import { PrismaService } from '@db';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma, SponsorDonationStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { GetDonationPostQuery } from './getDonationPost.query';
import { GetDonationPostResponse } from './getDonationPost.response';

type GetDonationPostDto = Prisma.DonationPostGetPayload<{
  select: {
    id: true;
    description: true;
    moneyNeed: true;
    deadline: true;
    status: true;
    necessariesList: true;
    donatedMoney: true;
    donationNeccessaries: {
      select: {
        id: true;
        quantity: true;
        donatedQuantity: true;
        reliefNeccessary: {
          select: {
            name: true;
          };
        };
      };
    };
    sponsorDonations: {
      select: {
        sponsorUser: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            middleName: true;
          };
        };
        status: true;
      };
    };
  };
}>;

@QueryHandler(GetDonationPostQuery)
export class GetDonationPostHandler
  implements IQueryHandler<GetDonationPostQuery, GetDonationPostResponse>
{
  constructor(private readonly dbContext: PrismaService) {}

  private map(donationPost: GetDonationPostDto): GetDonationPostResponse {
    const {
      deadline,
      description,
      donatedMoney,
      donationNeccessaries,
      id,
      moneyNeed,
      necessariesList,
      sponsorDonations,
      status,
    } = donationPost;

    const sponsorCompletedDonations = sponsorDonations.filter(
      (sD) => sD.status === SponsorDonationStatus.COMPLETED,
    );

    return {
      deadline: dayjs(deadline).toISOString(),
      description,
      donatedMoney,
      id,
      moneyNeed,
      necessariesList,
      status,
      sponsors: sponsorCompletedDonations.map(({ sponsorUser }) => {
        return {
          id: sponsorUser.id,
          name: `${sponsorUser.lastName} ${sponsorUser.middleName ?? ''} ${
            sponsorUser.firstName
          }`,
        };
      }),
      necessaries: donationNeccessaries.map(
        ({ donatedQuantity, id, quantity, reliefNeccessary: { name } }) => {
          return {
            donatedQuantity,
            id,
            name,
            quantity,
          };
        },
      ),
    };
  }

  private async getDonationPost(id: string) {
    const donationPost = await this.dbContext.donationPost.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        description: true,
        moneyNeed: true,
        deadline: true,
        status: true,
        necessariesList: true,
        donatedMoney: true,
        donationNeccessaries: {
          select: {
            id: true,
            quantity: true,
            donatedQuantity: true,
            reliefNeccessary: {
              select: {
                name: true,
              },
            },
          },
        },
        sponsorDonations: {
          select: {
            sponsorUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
              },
            },
            status: true,
          },
        },
      },
    });

    if (!donationPost)
      throw new NotFoundException('Bài kêu gọi quyên góp không tồn tại');

    return donationPost;
  }

  async execute(query: GetDonationPostQuery): Promise<GetDonationPostResponse> {
    const donationPost = await this.getDonationPost(query.id);

    return this.map(donationPost);
  }
}
