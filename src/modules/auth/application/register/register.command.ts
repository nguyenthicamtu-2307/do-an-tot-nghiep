import { RegisterRequestBody } from './register.request-body';

export class RegisterCommand {
  constructor(public readonly body: RegisterRequestBody) {}
}
