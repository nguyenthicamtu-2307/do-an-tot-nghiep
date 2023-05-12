import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { RefreshQuery } from './refresh.query';
import { RefreshResponse } from './refresh.response';

@QueryHandler(RefreshQuery)
export class RefreshHandler
  implements IQueryHandler<RefreshQuery, RefreshResponse>
{
  constructor(private jwtService: JwtService) {}

  private map(username, token): RefreshResponse {
    return {
      username,
      accessToken: token,
    };
  }

  async execute(query: RefreshQuery): Promise<RefreshResponse> {
    const { username, userType, email, id, phoneNumber } = query.requestUser;

    const payload = {
      username,
      userType,
      email,
      id,
      phoneNumber,
    };

    const token = this.jwtService.sign(payload);

    return this.map(username, token);
  }
}
