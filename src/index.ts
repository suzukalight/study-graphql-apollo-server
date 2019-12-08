import express from "express";
import cors from "cors";
import { ApolloServer, gql, IResolvers } from "apollo-server-express";

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    me: User
    users: [User!]
    user(id: ID!): User

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

interface User {
  id: string;
  firstName: string;
  lastName: string;
}
interface Users {
  [key: string]: User;
}

const users: Users = {
  "1": { id: "1", firstName: "masahiko", lastName: "kubara" },
  "2": { id: "2", firstName: "suzuka", lastName: "light" }
};

interface Message {
  id: string;
  text: string;
  userId: string;
}
interface Messages {
  [key: string]: Message;
}

const messages: Messages = {
  "1": { id: "1", text: "Hello, world!", userId: "1" },
  "2": { id: "2", text: "from GraphQL and Apollo-Server.", userId: "2" }
};

const resolvers: IResolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    users: () => Object.values(users),
    user: (parent, { id }) => users[id],
    messages: () => Object.values(messages),
    message: (parent, { id }) => messages[id]
  },
  User: {
    username: (user: User) => `${user.firstName} ${user.lastName}`
  },
  Message: {
    user: (message: Message) => users[message.userId]
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: { me: users[2] }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 23456 }, () => {
  console.log("server on http://localhost:23456/graphql");
});
