import { Models } from './models';

export const createUsersWithMessages = async (models: Models, date = new Date()) => {
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

  for (let i = 0; i < 5; i++) {
    await user2.createMessage({
      text: `message #${i + 1}`,
      createdAt: new Date(date).setSeconds(date.getSeconds() + i),
    });
  }
};
