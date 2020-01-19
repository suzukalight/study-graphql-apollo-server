import { Op } from 'sequelize';
import deepmerge from 'deepmerge';

import Message from '../models/message';
import { fromCursorHash, toCursorHash } from '../utils/hash';
import { ServiceContext } from '../typings';
// import pubsub, { EVENTS } from '../../application/subscription';

type Filters = {
  userId?: number;
};

type Orders = {};

type PageInfo = {
  cursor?: string;
  limit?: number;
};

type FindAllArgs = {
  filters?: Filters;
  orders?: Orders;
  pageInfo?: PageInfo;
};

type PagingOptions = {
  order: [['createdAt', 'DESC']];
  where?: { createdAt: { [Op.lt]: string } };
  limit?: number;
};

const beforePaging = (pageInfo?: PageInfo): PagingOptions | {} => {
  if (!pageInfo) return {};

  const { cursor = '', limit = 0 } = pageInfo ?? {};
  let cursorOptions: PagingOptions = { order: [['createdAt', 'DESC']] };
  if (cursor) {
    cursorOptions = {
      ...cursorOptions,
      where: { createdAt: { [Op.lt]: fromCursorHash(cursor) } },
    };
  }
  if (limit) {
    cursorOptions = { ...cursorOptions, limit: limit + 1 };
  }
  return cursorOptions;
};

const beforeFilters = (filters: Filters | undefined) => {
  const userId = filters?.userId;
  return userId ? { where: { userId } } : {};
};

export const findAll = async (
  { filters, orders, pageInfo }: FindAllArgs,
  { models }: ServiceContext,
) => {
  const { limit = 0 } = pageInfo ?? {};
  const cursorOptions = beforePaging(pageInfo);
  const filterOptions = beforeFilters(filters);
  const orderOptions = orders || {};

  const messages = await models.Message.findAll(
    deepmerge.all([cursorOptions, filterOptions, orderOptions]),
  );

  if (!pageInfo) return messages;

  const hasNextPage = limit ? messages.length > limit : false;
  const edges = hasNextPage ? messages.slice(0, -1) : messages;
  const lastCreatedAt = edges[edges.length - 1]?.createdAt?.toString();
  const endCursor = lastCreatedAt && toCursorHash(lastCreatedAt);

  return {
    edges,
    pageInfo: {
      hasNextPage,
      endCursor,
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
