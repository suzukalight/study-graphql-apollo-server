import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isMessageOwner } from '../authorization';
import * as MessageService from '../../../domain/services/message';

export const createMessage = combineResolvers(isAuthenticated, (parent, args, ctx) =>
  MessageService.create(args, ctx),
);

export const deleteMessage = combineResolvers(
  isAuthenticated,
  isMessageOwner,
  (parent, { id }, ctx) => MessageService.remove(id, ctx),
);
