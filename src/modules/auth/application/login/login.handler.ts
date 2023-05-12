import { PrismaService } from '@db';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { uid } from 'rand-token';
import { LoginCommand } from './login.command';
import { LoginResponse } from './login.response';

@CommandHandler(LoginCommand)
export class LoginHandler
  implements ICommandHandler<LoginCommand, LoginResponse>
{
  constructor(
    private jwtService: JwtService,
    private readonly dbContext: PrismaService,
  ) {}

  async saveRefreshToken(refreshToken: string, userId: string): Promise<void> {
    await this.dbContext.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenId: refreshToken,
      },
    });
  }

  private map(
    username: string,
    accessToken: string,
    refreshToken: string,
  ): LoginResponse {
    return {
      username,
      accessToken,
      refreshToken,
    };
  }

  async execute(command: LoginCommand): Promise<LoginResponse> {
    const user = await this.dbContext.user.findFirst({
      where: {
        username: command.username,
      },
      select: {
        id: true,
        username: true,
        userType: true,
        email: true,
        phoneNumber: true,
      },
    });
    if (!user) {
      throw new NotFoundException('The user cannot be found.');
    }

    // access token generate
    const payload = {
      username: user.username,
      userType: user.userType,
      email: user.email,
      id: user.id,
      phoneNumber: user.phoneNumber,
    };
    const token = this.jwtService.sign(payload);
    // refresh token generate
    const refreshToken = uid(16);

    await this.saveRefreshToken(refreshToken, user.id);

    return this.map(user.username, token, refreshToken);
  }
}
