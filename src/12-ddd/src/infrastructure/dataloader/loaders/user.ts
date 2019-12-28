import { Op } from 'sequelize';

import { Models } from '../../../domain/models';

export const batchUsers = async (keys: readonly number[], models: Models) => {
  const users = await models.User.findAll({
    where: { id: { [Op.in]: keys } },
  });

  return keys.map(key => users.find(user => user.id === key) || new Error(`No result for ${key}`));
};
