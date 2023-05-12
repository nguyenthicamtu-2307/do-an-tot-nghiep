import { PutReliefPlanRequestBody } from './putReliefPlan.request-body';

export class PutReliefPlanCommand {
  constructor(
    public readonly userId: string,
    public readonly reliefId: string,
    public readonly body: PutReliefPlanRequestBody,
  ) {}
}
