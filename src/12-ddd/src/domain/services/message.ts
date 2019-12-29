import { Op } from 'sequelize';

import Message from '../models/message';
import { fromCursorHash, toCursorHash } from '../utils/hash';
import { ServiceContext } from '../typings';
// import pubsub, { EVENTS } from '../../application/subscription';

export const findAll = async (
  { cursor, limit = 100 }: { cursor: string; limit: number },
  { models }: ServiceContext,
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

export const findOne = async (id: number, { models }: ServiceContext) =>
  models.Message.findByPk(id);

export const create = async ({ text }: Message, { me, models }: ServiceContext) => {
  const message = await models.Message.create({
    text,
    userId: me?.id,
  });

  // pubsub.publish(EVENTS.MESSAGE.CREATED, { messageCreated: { message } });

  return message;
};

export const remove = async (id: number, { models }: ServiceContext) =>
  models.Message.destroy({ where: { id } });
