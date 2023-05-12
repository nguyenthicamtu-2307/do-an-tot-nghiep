import { SetMetadata } from '@nestjs/common';

export const USER_TYPE_KEYS = 'userTypes';
export const UserTypes = (...args: string[]) =>
  SetMetadata(USER_TYPE_KEYS, args);
