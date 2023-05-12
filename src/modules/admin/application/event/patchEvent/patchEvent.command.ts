import { PatchEventRequestBody } from './patchEvent.request-body';

export class PatchEventCommand {
  constructor(
    public readonly body: PatchEventRequestBody,
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
