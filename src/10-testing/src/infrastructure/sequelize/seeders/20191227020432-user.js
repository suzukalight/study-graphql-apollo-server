'use strict';

const bcrypt = require('bcrypt');

const saltRounds = 10;
const generatePasswordHash = async password => bcrypt.hash(password, saltRounds);

module.exports = {
  up: async queryInterface =>
    queryInterface.bulkInsert(
      'users',
      [
        {
          firstName: 'masahiko',
          lastName: 'kubara',
          email: 'masahiko_kubara@email.com',
          password: await generatePasswordHash('masahikokubara'),
          role: 'member',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'suzuka',
          lastName: 'light',
          email: 'suzukalight@email.com',
          password: await generatePasswordHash('suzukalight'),
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    ),

  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};
