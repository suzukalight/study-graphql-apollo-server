import { Models } from './models';

export const createUsersWithMessages = async (models: Models) => {
  await models.User.create({
    firstName: 'masahiko',
    lastName: 'kubara',
    email: 'masahiko_kubara@email.com',
    password: 'masahikokubara',
    role: 'member',
  });

  const user2 = await models.User.create({
    firstName: 'suzuka',
    lastName: 'light',
    email: 'suzukalight@email.com',
    password: 'suzukalight',
    role: 'admin',
  });

  await user2.createMessage({
    text: 'associate message',
  });
};
