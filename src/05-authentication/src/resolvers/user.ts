import { IResolvers } from 'apollo-server-express';

import User from '../models/user';
import { ResolverContext } from './typings';

const createToken = async (user: User) => 'dummy';

const resolvers: IResolvers<User, ResolverContext> = {
  Query: {
    me: async (parent, args, { models, me }) => models.User.findByPk(me.id),
    users: async (parent, args, { models }) => models.User.findAll(),
    user: async (parent, { id }, { models }) => models.User.findByPk(id),
  },

  Mutation: {
    signUp: async (parent, { lastName, firstName, email, password }, { models }) => {
      const user = await models.User.create({ lastName, firstName, email, password });
      return { token: createToken(user) };
    },
  },

  User: {
    username: async user => `${user.firstName} ${user.lastName}`,
    messages: async (user, args, { models }) =>
      models.Message.findAll({
        where: { userId: user.id },
      }),
  },
};

export default resolvers;
