import { User } from '@prisma/client';
import { CreateEventRequestBody } from './createEvent.request-body';

export class CreateEventCommand {
  constructor(
    public readonly body: CreateEventRequestBody,
    public readonly requestUser: User,
  ) {}
}
