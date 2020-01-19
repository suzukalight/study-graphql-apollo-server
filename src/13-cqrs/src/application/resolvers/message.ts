import { IResolvers } from 'apollo-server-express';
import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isMessageOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';
import Message from '../../domain/models/message';
import * as MessageService from '../../domain/services/message';

import { ResolverContext } from './typings';

const resolvers: IResolvers<Message, ResolverContext> = {
  Query: {
    messages: async (parent, args, ctx) => MessageService.findAll({ pageInfo: args }, ctx),
    message: (parent, { id }, ctx) => MessageService.findOne(id, ctx),
  },

  Mutation: {
    createMessage: combineResolvers(isAuthenticated, (parent, args, ctx) =>
      MessageService.create(args, ctx),
    ),
    deleteMessage: combineResolvers(isAuthenticated, isMessageOwner, (parent, { id }, ctx) =>
      MessageService.remove(id, ctx),
    ),
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },

  Message: {
    user: async (message, args, { loaders }) => loaders.user.load(message.userId),
  },
};

export default resolvers;
