import { IResolvers, UserInputError, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import { ResolverContext } from './typings';

const createToken = async (user: User, secret: string, expiresIn: string) => {
  const { id, email } = user;
  return await jwt.sign({ id, email }, secret, { expiresIn });
};

const resolvers: IResolvers<User, ResolverContext> = {
  Query: {
    me: async (parent, args, { models, me }) => models.User.findByPk(me.id),
    users: async (parent, args, { models }) => models.User.findAll(),
    user: async (parent, { id }, { models }) => models.User.findByPk(id),
  },

  Mutation: {
    signUp: async (parent, { lastName, firstName, email, password }, { models, jwt }) => {
      const user = await models.User.create({ lastName, firstName, email, password });
      return { token: createToken(user, jwt.secret, jwt.expiresIn) };
    },
    signIn: async (parent, { email, password }, { models, jwt }) => {
      const user = await models.User.findByEmail(email);
      if (!user) throw new UserInputError('No user found with this login credentials.');

      const isValid = await user.validatePassword(password);
      if (!isValid) throw new AuthenticationError('Invalid password.');

      return { token: createToken(user, jwt.secret, jwt.expiresIn) };
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
