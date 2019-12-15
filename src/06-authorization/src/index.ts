import express, { Request } from 'express';
import cors from 'cors';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import { createUsersWithMessages } from './seed';
import User from './models/user';

dotenv.config();

const app = express();

app.use(cors());

const getMe = async (req: Request) => {
  const token = <string>req.headers['x-token'];
  if (!token) return null;

  try {
    return <User>jwt.verify(token, <string>process.env.JWT_SECRET);
  } catch (e) {
    throw new AuthenticationError('Your session expired. Sign in again.');
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req }) => {
    const me = await getMe(req);
    return {
      models,
      me,
      jwt: { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN },
    };
  },
  formatError: error => {
    const message = error.message
      .replace('Sequelize ValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(models);
  }

  app.listen({ port: 23456 }, () => {
    console.log('Apollo Server on http://localhost:23456/graphql');
  });
});
