import { GetUsersRequestQuery } from './getUsers.request-query';

export class GetUsersQuery {
  constructor(
    public readonly option: GetUsersRequestQuery,
    public readonly userId: string,
  ) {}
}
