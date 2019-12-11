import { IResolvers } from 'apollo-server-express';
import uuidv4 from 'uuid/v4';

const resolvers: IResolvers = {
  Query: {
    messages: (parent, args, { models }) => Object.values(models.messages),
    message: (parent, { id }, { models }) => models.messages[id],
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };
      models.messages[id] = message;
      console.log('message keys', Object.keys(models.messages));
      return message;
    },
    deleteMessage: (parent, { id }, { models }) => {
      const { [id]: message, ...otherMesasges } = models.messages;
      if (!message) return false;
      models.messages = otherMesasges;
      console.log('message keys', Object.keys(models.messages));
      return true;
    },
  },

  Message: {
    user: (message: Message, args, { models }) => models.users[message.userId],
  },
};

export default resolvers;
