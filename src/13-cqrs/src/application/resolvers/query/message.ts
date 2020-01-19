import * as MessageService from '../../../domain/services/message';

import Message from '../../../domain/models/message';
import { ResolverContext } from '../typings';

export const messages = async (parent: Message, args: PageInfo, ctx: ResolverContext) =>
  MessageService.findAll({ pageInfo: args }, ctx);

export const message = async (parent: Message, { id }: Message, ctx: ResolverContext) =>
  MessageService.findOne(id, ctx);
