import { IResolvers, UserInputError, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';

import { isAdmin } from './authorization';
import User from '../../domain/models/user';
import * as UserService from '../../domain/services/user';
import * as MessageService from '../../domain/services/message';

import { ResolverContext } from './typings';

const createToken = async (user: User, secret: string, expiresIn: string) => {
  const { id, email, role } = user;
  return await jwt.sign({ id, email, role }, secret, { expiresIn });
};

const resolvers: IResolvers<User, ResolverContext> = {
  Query: {
    me: async (parent, args, { models, me }) => {
      if (!me?.id) return null;
      return UserService.findOne(me?.id, { models, me });
    },
    users: (parent, options, ctx) => UserService.findAll(options, ctx),
    user: (parent, { id }, ctx) => UserService.findOne(id, ctx),
  },

  Mutation: {
    signUp: async (parent, args, { models, jwt }) => {
      const user = await UserService.create(args, { models });
      return { token: createToken(user, jwt.secret, jwt.expiresIn) };
    },
    signIn: async (parent, { email, password }, { models, jwt }) => {
      const user = await UserService.findByEmail(email, { models });
      if (!user) throw new UserInputError('No user found with this login credentials.');

      const isValid = await user.validatePassword(password);
      if (!isValid) throw new AuthenticationError('Invalid password.');

      return { token: createToken(user, jwt.secret, jwt.expiresIn) };
    },
    deleteUser: combineResolvers(isAdmin, async (parent, { id }, ctx) =>
      UserService.remove(id, ctx),
    ),
  },

  User: {
    username: async user => `${user.firstName} ${user.lastName}`,
    messages: async (user, args, { models }) =>
      MessageService.findAll({ filters: { userId: user.id } }, { models }),
  },
};

export default resolvers;
