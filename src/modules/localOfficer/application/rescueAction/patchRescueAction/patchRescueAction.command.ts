import { PatchRescueActionRequestBody } from './patchRescueAction.request-body';

export class PatchRescueActionCommand {
  constructor(
    public readonly body: PatchRescueActionRequestBody,
    public readonly subscriptionId: string,
    public readonly userId: string,
  ) {}
}
