import { PutEventRequestBody } from './putEvent.request-body';

export class PutEventCommand {
  constructor(
    public readonly body: PutEventRequestBody,
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
