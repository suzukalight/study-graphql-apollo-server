import DataLoader from 'dataloader';

import User from '../../domain/models/user';
import { Models } from '../../domain/models';

export interface ResolverContext {
  me: User | null;
  models: Models;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  loaders: {
    user: DataLoader<number, User>;
  };
}
