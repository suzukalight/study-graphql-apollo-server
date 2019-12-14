import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import { createUsersWithMessages } from './seed';

dotenv.config();

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByPk(2),
    jwt: { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN },
  }),
  formatError: error => {
    const message = error.message
      .replace('Sequelize ValicationError: ', '')
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
