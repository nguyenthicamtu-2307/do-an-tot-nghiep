export class GetSubscriptionsQuery {
  constructor(
    public readonly eventId: string,
    public readonly userId: string,
  ) {}
}
