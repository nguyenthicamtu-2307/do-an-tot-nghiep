import { PostReliefPlanRequestBody } from './postReliefPlan.request-body';

export class PostReliefPlanCommand {
  constructor(
    public readonly userId: string,
    public readonly subscriptionId: string,
    public readonly body: PostReliefPlanRequestBody,
  ) {}
}
