import { User } from '@prisma/client';

export class RefreshQuery {
  constructor(public readonly requestUser: User) {}
}
