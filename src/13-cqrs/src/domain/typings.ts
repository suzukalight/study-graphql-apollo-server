import { Models } from './models';
import User from './models/user';

export type ServiceContext = {
  me?: User | null;
  models: Models;
};
