import { PrismaService } from '@db';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Strategy } from 'passport-local';

type GetUserDTO = Prisma.UserGetPayload<{
  select: {
    id: true;
    avatarUrl: true;
    username: true;
    userType: true;
    firstName: true;
    lastName: true;
    middleName: true;
    phoneNumber: true;
    email: true;
    status: true;
    password: true;
    refreshTokenId: true;
  };
}>;

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly dbContext: PrismaService) {
    super();
  }

  async validate(username: string, password: string): Promise<GetUserDTO> {
    try {
      const user = await this.dbContext.user.findFirst({
        where: {
          username,
        },
        select: {
          id: true,
          avatarUrl: true,
          username: true,
          userType: true,
          firstName: true,
          lastName: true,
          middleName: true,
          phoneNumber: true,
          email: true,
          status: true,
          password: true,
          refreshTokenId: true,
        },
      });
      if (!user) {
        throw new NotFoundException('The user cannot be found');
      }
      const isPasswordEqual = bcrypt.compareSync(password, user.password);
      // const isPasswordEqual = user.password === password;
      if (isPasswordEqual) {
        return user;
      } else {
        throw new HttpException(
          'WRONG PROVIDED CREDENTIAL: WRONG PASSWORD',
          401,
        );
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('WRONG PROVIDED CREDENTIAL', 401);
    }
  }
}
