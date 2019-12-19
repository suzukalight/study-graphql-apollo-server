import { IResolvers } from 'apollo-server-express';
import { combineResolvers } from 'graphql-resolvers';
import { Op } from 'sequelize';

import Message from '../models/message';
import { ResolverContext } from './typings';
import { isAuthenticated, isMessageOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';

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
    message: async (parent, { id }, { models }) => models.Message.findByPk(id),
  },

  Mutation: {
    createMessage: combineResolvers(isAuthenticated, async (parent, { text }, { me, models }) => {
      const message = models.Message.create({
        text,
        userId: me?.id,
      });

      pubsub.publish(EVENTS.MESSAGE.CREATED, { messageCreated: { message } });

      return message;
    }),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) =>
        models.Message.destroy({
          where: { id },
        }),
    ),
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },

  Message: {
    user: async (message, args, { models }) => models.User.findByPk(message.userId),
  },
};

export default resolvers;
