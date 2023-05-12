import { PrismaService } from '@db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly dbContext: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request!.headers!.authorization!.split(' ')[1];
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.dbContext.user.findFirst({
      where: {
        id: payload.id,
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
      throw new NotFoundException('User cannot be found.');
    }

    return user;
  }
}
