import { Request } from 'express';
import { UserDocument } from 'src/auth/entities/user.entity';

export type RequestUser = Pick<UserDocument, 'email' | 'name'> & { id: string };

export interface AuthRequest extends Request {
  user: RequestUser;
}
