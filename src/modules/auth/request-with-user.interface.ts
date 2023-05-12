import { User } from '@prisma/client';
import { Request } from 'express';

export interface RequestUser extends Request {
  user: User;
}

export default RequestUser;
