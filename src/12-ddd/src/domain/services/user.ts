import User from '../models/user';
import { ServiceContext } from '../typings';

export const findAll = async (options: Record<string, any>, { models }: ServiceContext) =>
  models.User.findAll(options);

export const findOne = async (id: number, { models }: ServiceContext) => models.User.findByPk(id);

export const findByEmail = async (email: string, { models }: ServiceContext) =>
  models.User.findByEmail(email);

export const create = async (args: User, { models }: ServiceContext) => models.User.create(args);

export const remove = async (id: number, { models }: ServiceContext) =>
  models.User.destroy({ where: { id } });
