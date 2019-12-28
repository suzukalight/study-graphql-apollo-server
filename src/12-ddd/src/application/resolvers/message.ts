import { IResolvers } from 'apollo-server-express';
import { combineResolvers } from 'graphql-resolvers';
import { Op } from 'sequelize';

import Message from '../../domain/models/message';
import { ResolverContext } from './typings';
import { isAuthenticated, isMessageOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';
import * as MessageService from '../../domain/services/messages';

const toCursorHash = (string: string) => Buffer.from(string).toString('base64');
const fromCursorHash = (string: string) => Buffer.from(string, 'base64').toString('ascii');

const resolvers: IResolvers<Message, ResolverContext> = {
  Query: {
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: { createdAt: { [Op.lt]: fromCursorHash(cursor) } },
          }
        : {};
      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });
      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString()),
        },
      };
    },
    message: MessageService.findOne,
  },

  Mutation: {
    createMessage: combineResolvers(isAuthenticated, MessageService.create),
    deleteMessage: combineResolvers(isAuthenticated, isMessageOwner, MessageService.remove),
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
