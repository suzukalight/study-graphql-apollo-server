import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    messages(cursor: String, limit: Int): MessageConnection!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: Date!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
    createdAt: Date!
  }
`;

export default schema;
