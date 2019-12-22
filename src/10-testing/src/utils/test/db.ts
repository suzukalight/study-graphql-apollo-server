import models, { sequelize } from '../../models';
import { createUsersWithMessages } from '../../seed';

export const reset = async () => {
  await sequelize.sync({ force: true });
  await createUsersWithMessages(models);
};
