import { GraphQLDateTime } from 'graphql-iso-date';

import Query from './query';
import Mutation from './mutation';
import Resolvers from './resolvers';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [customScalarResolver, Query, Mutation, Resolvers];
