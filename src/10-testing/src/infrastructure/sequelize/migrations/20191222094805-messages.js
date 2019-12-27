'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'messages',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        text: {
          type: Sequelize.STRING(65500),
          validate: {
            notEmpty: {
              msg: 'A message has to have a text.',
            },
          },
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        charset: 'utf8mb4',
      },
    ),

  down: queryInterface => queryInterface.dropTable('messages'),
};
