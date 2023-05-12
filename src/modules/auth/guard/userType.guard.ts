import { USER_TYPE_KEYS } from '@common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class UserTypesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routeUserTypes = this.reflector.getAllAndOverride<string[]>(
      USER_TYPE_KEYS,
      [context.getClass(), context.getHandler()],
    );

    if (!routeUserTypes) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;
    if (!user) {
      return false;
    }

    // const hasUserType = () => {
    //   return routeUserTypes.includes(user);
    // };

    // return hasUserType();
    return true;
  }
}
