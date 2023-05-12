import { PostProofRequestBody } from './postProof.request-body';

export class PostProofCommand {
  constructor(
    public readonly userId: string,
    public readonly rescueSubscriptionId: string,
    public readonly body: PostProofRequestBody,
  ) {}
}
