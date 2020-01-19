import { UserInputError, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';

import { isAdmin } from '../authorization';
import * as UserService from '../../../domain/services/user';

import User from '../../../domain/models/user';
import { ResolverContext } from '../typings';

const createToken = async (user: User, secret: string, expiresIn: string) => {
  const { id, email, role } = user;
  return await jwt.sign({ id, email, role }, secret, { expiresIn });
};

export const signUp = async (parent: User, args: User, { models, jwt }: ResolverContext) => {
  const user = await UserService.create(args, { models });
  return { token: createToken(user, jwt.secret, jwt.expiresIn) };
};

export const signIn = async (
  parent: User,
  { email, password }: User,
  { models, jwt }: ResolverContext,
) => {
  const user = await UserService.findByEmail(email, { models });
  if (!user) throw new UserInputError('No user found with this login credentials.');

  const isValid = await user.validatePassword(password);
  if (!isValid) throw new AuthenticationError('Invalid password.');

  return { token: createToken(user, jwt.secret, jwt.expiresIn) };
};

export const deleteUser = combineResolvers(isAdmin, async (parent, { id }, ctx: ResolverContext) =>
  UserService.remove(id, ctx),
);
