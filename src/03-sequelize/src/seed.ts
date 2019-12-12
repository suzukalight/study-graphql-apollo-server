import { Models } from './models';

export const createUsersWithMessages = async (models: Models) => {
  await models.User.create({
    firstName: 'masahiko',
    lastName: 'kubara',
  });

  const user2 = await models.User.create({
    firstName: 'suzuka',
    lastName: 'light',
  });

  await user2.createMessage({
    text: 'associate message',
  });
};
