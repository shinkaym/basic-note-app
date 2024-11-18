import { ApolloServer } from '@apollo/server';
import express from 'express';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import { typeDefs } from './schemas/index.js';
import { resolvers } from './resolvers/index.js';

import './configs/firebase.config.js';
import admin from 'firebase-admin';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const app = express();
const httpServer = http.createServer(app);

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xqw42.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const PORT = process.env.PORT || 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(' ')[1];

    admin
      .auth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        res.locals.uid = decodedToken.uid;
        next();
      })
      .catch((err) => {
        return res.status(403).json({ message: 'Forbidden', error: err });
      });
  } else {
    // return res.status(401).json({ message: 'Unauthorized' });
    next()
  }
};

app.use(
  cors(),
  authorizationJWT,
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      return { uid: res.locals.uid };
    },
  })
);

mongoose
  .connect(URI, {
    // useFindAndModify: false,
    // useCreateIndex: true,
  })
  .then(async () => {
    console.log('Connected to MongoDB');

    await new Promise((resolve, reject) => {
      httpServer.listen({ port: process.env.PORT || 4000 }, () => {
        console.log(`Server ready at http://localhost:${PORT}`);
        resolve();
      });
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });
