import { skip } from 'graphql-resolvers';
import { ForbiddenError } from 'apollo-server-express';
import { ResolverContext } from './typings';
import Message from '../models/message';

export const isAuthenticated = (parent: any, args: any, { me }: ResolverContext) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');

export const isMessageOwner = async (
  parent: any,
  { id }: Message,
  { models, me }: ResolverContext,
) => {
  const message = await models.Message.findByPk(id, { raw: true });
  if (!message || message.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }
  return skip;
};
