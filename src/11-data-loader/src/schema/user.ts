import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    me: User
    users: [User!]
    user(id: ID!): User
  }

  extend type Mutation {
    signUp(lastName: String!, firstName: String!, email: String!, password: String!): Token!
    signIn(email: String!, password: String!): Token!
    deleteUser(id: ID!): Boolean
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    messages: [Message!]
    role: String
  }
`;

export default schema;
