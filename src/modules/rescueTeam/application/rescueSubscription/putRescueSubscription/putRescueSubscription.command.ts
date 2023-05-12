import { PutRescueSubscriptionRequestBody } from './putRescueSubscription.request-body';

export class PutRescueSubscriptionCommand {
  constructor(
    public readonly body: PutRescueSubscriptionRequestBody,
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
