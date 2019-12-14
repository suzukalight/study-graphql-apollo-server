import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    me: User
    users: [User!]
    user(id: ID!): User
  }

  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    messages: [Message!]
  }
`;

export default schema;
