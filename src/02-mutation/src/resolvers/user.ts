import { IResolvers } from 'apollo-server-express';
import uuidv4 from 'uuid/v4';

const resolvers: IResolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    users: (parent, args, { models }) => Object.values(models.users),
    user: (parent, { id }, { models }) => models.users[id],
  },

  User: {
    username: (user: User) => `${user.firstName} ${user.lastName}`,
    messages: (user: User, args, { models }) =>
      Object.values<Message>(models.messages)
        .filter((m: Message) => +m.userId === +user.id)
        .map((m: Message) => models.messages[m.id]),
  },
};

export default resolvers;
