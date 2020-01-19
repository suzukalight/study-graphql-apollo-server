import MessageType from '../../../domain/models/message';
import { ResolverContext } from '../typings';

const user = async (message: MessageType, args: MessageType, { loaders }: ResolverContext) =>
  loaders.user.load(message.userId);

export default {
  user,
};
