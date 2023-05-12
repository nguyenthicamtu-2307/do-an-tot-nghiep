import { PatchSubscriptionRequestBody } from './patchSubscription.request-body';

export class PatchSubscriptionCommand {
  constructor(
    public readonly userId: string,
    public readonly subscriptionId: string,
    public readonly body: PatchSubscriptionRequestBody,
  ) {}
}
