import { Op } from 'sequelize';

import Message from '../models/message';
import { ResolverContext } from '../../application/resolvers/typings';
import pubsub, { EVENTS } from '../../application/subscription';

const toCursorHash = (string: string) => Buffer.from(string).toString('base64');
const fromCursorHash = (string: string) => Buffer.from(string, 'base64').toString('ascii');

export const findAll = async (
  parent: Message,
  { cursor, limit = 100 }: { cursor: string; limit: number },
  { models }: ResolverContext,
) => {
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
};

export const findOne = async (
  parent: Message,
  { id }: { id: number },
  { models }: ResolverContext,
) => models.Message.findByPk(id);

export const create = async (
  parent: Message,
  { text }: Message,
  { me, models }: ResolverContext,
) => {
  const message = await models.Message.create({
    text,
    userId: me?.id,
  });

  pubsub.publish(EVENTS.MESSAGE.CREATED, { messageCreated: { message } });

  return message;
};

export const remove = async (parent: Message, { id }: Message, { models }: ResolverContext) =>
  models.Message.destroy({ where: { id } });
