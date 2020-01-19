import * as message from './message';
import * as user from './user';

export default {
  Query: {
    ...message,
    ...user,
  },
};
