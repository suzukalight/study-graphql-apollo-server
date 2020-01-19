import * as message from './message';
import * as user from './user';

export default {
  Mutation: {
    ...message,
    ...user,
  },
};
