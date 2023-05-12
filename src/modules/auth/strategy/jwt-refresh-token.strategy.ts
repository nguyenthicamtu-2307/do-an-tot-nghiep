import { PrismaService } from '@db';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly dbContext: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req?.cookies?.Refresh;
    const user = await this.dbContext.user.findFirst({
      where: {
        id: payload.userId,
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
        refreshTokenId: true,
      },
    });
    if (!user) {
      throw new NotFoundException('The user cannot be found.');
    }
    const isRefreshTokenEqual = bcrypt.compareSync(
      refreshToken,
      user.refreshTokenId!,
    );
    if (isRefreshTokenEqual) {
      return user;
    } else {
      throw new HttpException('UNAUTHORIZED', 401);
    }
  }
}
