import { PrismaService } from '@db';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcryptjs';
import { RegisterCommand } from './register.command';
import { RegisterRequestBody } from './register.request-body';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand, void> {
  constructor(private readonly dbContext: PrismaService) {}

  async createUser(body: RegisterRequestBody): Promise<void> {
    const {
      districtId,
      email,
      firstName,
      lastName,
      middleName,
      password,
      phoneNumber,
      provinceId,
      userType,
      wardId,
    } = body;

    const user = await this.dbContext.user.findFirst({
      where: {
        userType: body.userType,
        email: body.email,
      },
    });
    if (user) throw new BadRequestException('The user is already exist.');

    const saltPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

    await this.dbContext.user.create({
      data: {
        username: `${userType.toLocaleLowerCase()}|${email}`,
        districtId,
        email,
        firstName,
        lastName,
        password: saltPassword,
        phoneNumber,
        provinceId,
        userType,
        wardId,
        middleName,
      },
    });
  }

  async execute(command: RegisterCommand): Promise<void> {
    return await this.createUser(command.body);
  }
}
