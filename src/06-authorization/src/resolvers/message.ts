import { IResolvers } from 'apollo-server-express';
import { combineResolvers } from 'graphql-resolvers';

import Message from '../models/message';
import { ResolverContext } from './typings';
import { isAuthenticated, isMessageOwner } from './authorization';

const resolvers: IResolvers<Message, ResolverContext> = {
  Query: {
    messages: async (parent, args, { models }) => models.Message.findAll(),
    message: async (parent, { id }, { models }) => models.Message.findByPk(id),
  },

  Mutation: {
    createMessage: combineResolvers(isAuthenticated, async (parent, { text }, { me, models }) =>
      models.Message.create({
        text,
        userId: me.id,
      }),
    ),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) =>
        models.Message.destroy({
          where: { id },
        }),
    ),
  },

  Message: {
    user: async (message, args, { models }) => models.User.findByPk(message.userId),
  },
};

export default resolvers;
