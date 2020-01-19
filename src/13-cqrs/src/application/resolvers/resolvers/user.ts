import * as MessageService from '../../../domain/services/message';

import User from '../../../domain/models/user';
import { ResolverContext } from '../typings';

export const username = async (user: User) => `${user.firstName} ${user.lastName}`;

export const messages = async (user: User, args: unknown, { models }: ResolverContext) =>
  MessageService.findAll({ filters: { userId: user.id } }, { models });

export default {
  username,
  messages,
};
