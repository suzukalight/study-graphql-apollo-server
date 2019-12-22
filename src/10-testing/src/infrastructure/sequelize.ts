import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const storage = process.env.NODE_ENV === 'test' ? './testdatabase.sqlite' : './database.sqlite';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false,
});
