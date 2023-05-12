import { PatchRescueSubscriptionRequestBody } from './patchRescueSubscription.request-body';

export class PatchRescueSubscriptionCommand {
  constructor(
    public readonly body: PatchRescueSubscriptionRequestBody,
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
