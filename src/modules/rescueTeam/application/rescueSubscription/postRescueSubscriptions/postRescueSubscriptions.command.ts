import { PostRescueSubscriptionsRequestBody } from './postRescueSubscriptions.request-body';

export class PostRescueSubscriptionsCommand {
  constructor(
    public readonly userId: string,
    public readonly body: PostRescueSubscriptionsRequestBody,
  ) {}
}
