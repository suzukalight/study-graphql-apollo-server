import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.TEST_DATABASE || './database.sqlite',
  logging: false,
});
