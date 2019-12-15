import { IResolvers } from 'apollo-server-express';
import { combineResolvers } from 'graphql-resolvers';
import { Op } from 'sequelize';

import Message from '../models/message';
import { ResolverContext } from './typings';
import { isAuthenticated, isMessageOwner } from './authorization';

const resolvers: IResolvers<Message, ResolverContext> = {
  Query: {
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: { createdAt: { [Op.lt]: cursor } },
          }
        : {};
      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        ...cursorOptions,
      });
      return {
        edges: messages,
        pageInfo: { endCursor: messages[messages.length - 1].createdAt },
      };
    },
    message: async (parent, { id }, { models }) => models.Message.findByPk(id),
  },

  Mutation: {
    createMessage: combineResolvers(isAuthenticated, async (parent, { text }, { me, models }) =>
      models.Message.create({
        text,
        userId: me?.id,
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
