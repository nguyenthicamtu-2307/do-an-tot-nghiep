import { PostDonationPostRequestBody } from './postDonationPost.request-body';

export class PostDonationPostCommand {
  constructor(
    public readonly userId: string,
    public readonly subscriptionId: string,
    public readonly body: PostDonationPostRequestBody,
  ) {}
}
