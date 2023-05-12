import { PutSubscriptionRequestBody } from './putSubscription.request-body';

export class PutSubscriptionCommand {
  constructor(
    public readonly userId: string,
    public readonly subscriptionId: string,
    public readonly body: PutSubscriptionRequestBody,
  ) {}
}
