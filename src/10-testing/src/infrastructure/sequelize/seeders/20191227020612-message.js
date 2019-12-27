'use strict';

module.exports = {
  up: async queryInterface => {
    const date = new Date();
    const messages = [0, 1, 2, 3, 4].map(i => ({
      userId: 2,
      text: `message #${i + 1}`,
      createdAt: new Date(new Date(date).setSeconds(date.getSeconds() + i)),
      updatedAt: new Date(new Date(date).setSeconds(date.getSeconds() + i)),
    }));

    return await queryInterface.bulkInsert('messages', messages);
  },

  down: queryInterface => queryInterface.bulkDelete('messages', null, {}),
};
