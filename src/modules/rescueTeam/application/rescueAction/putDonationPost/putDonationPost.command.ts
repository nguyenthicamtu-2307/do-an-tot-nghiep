import { PutDonationPostRequestBody } from './putDonationPost.request-body';

export class PutDonationPostCommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly body: PutDonationPostRequestBody,
  ) {}
}
