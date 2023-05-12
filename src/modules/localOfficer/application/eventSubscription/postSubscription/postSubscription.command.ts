export class PostSubscriptionCommand {
  constructor(
    public readonly userId: string,
    public readonly eventId: string,
    public readonly householdNumber: number,
  ) {}
}
