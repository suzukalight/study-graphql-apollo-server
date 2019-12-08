import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    me: User
  }

  type User {
    username: String!
  }
`;

const resolvers = {
  Query: {
    me: () => ({ username: "mkubara" })
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 23456 }, () => {
  console.log("server on http://localhost:23456/graphql");
});
