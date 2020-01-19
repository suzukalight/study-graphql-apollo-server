import MessageType from '../../../domain/models/message';
import { ResolverContext } from '../typings';

export const Message = {
  user: async (message: MessageType, args: MessageType, { loaders }: ResolverContext) =>
    loaders.user.load(message.userId),
};
