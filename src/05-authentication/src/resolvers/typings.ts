import User from '../models/user';
import { Models } from '../models';

export interface ResolverContext {
  me: User;
  models: Models;
}
