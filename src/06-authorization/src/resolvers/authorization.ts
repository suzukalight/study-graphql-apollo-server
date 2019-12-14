import { skip } from 'graphql-resolvers';
import { ForbiddenError } from 'apollo-server-express';
import { ResolverContext } from './typings';

export const isAuthenticated = (parent: any, args: any, { me }: ResolverContext) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');
