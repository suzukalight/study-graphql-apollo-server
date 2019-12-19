import User from '../models/user';
import { Models } from '../models';

export interface ResolverContext {
  me: User | null;
  models: Models;
  jwt: {
    secret: string;
    expiresIn: string;
  };
}
