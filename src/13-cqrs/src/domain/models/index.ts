import { sequelize } from '../../infrastructure/sequelize';
import User from './user';
import Message from './message';

export { sequelize };

const models = {
  User,
  Message,
};

export type Models = typeof models;

export default models;
