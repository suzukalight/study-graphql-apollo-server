import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
// import messageResolvers from './message';

import Query from './query';
import Mutation from './mutation';
import { schemaType } from './resolvers';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [customScalarResolver, userResolvers, Query, Mutation, schemaType];
