import * as UserService from '../../../domain/services/user';

import User from '../../../domain/models/user';
import { ResolverContext } from '../typings';

export const me = async (parent: User, args: unknown, { models, me }: ResolverContext) => {
  if (!me?.id) return null;
  return UserService.findOne(me?.id, { models, me });
};

export const users = async (parent: User, options: FindAllOptions, ctx: ResolverContext) =>
  UserService.findAll(options, ctx);

export const user = async (parent: User, { id }: FindOneOptions, ctx: ResolverContext) =>
  UserService.findOne(id, ctx);
