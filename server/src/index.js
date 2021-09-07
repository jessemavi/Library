import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import cors from "cors";
import express from "express";
import expressJwt from "express-jwt";

import Database from "./dataSources/Database.js";
import resolvers from "./graphql/resolvers.js";
import typeDefs from "./graphql/typeDefs.js";
import permissions from "./graphql/permissions.js";
import cookieHeaderPlugin from "./graphql/plugins/cookieHeaderPlugin.js";
import { getToken, handleInvalidToken } from "./utils/tokens.js";

const port = process.env.GRAPHQL_API_PORT;
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: ['https://studio.apollographql.com', 'http://localhost:3000']
    })
  );
}

app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken
  }),
  handleInvalidToken
);

const knexConfig = {
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "",
    database: "book_library"
  },
};

const db = new Database(knexConfig);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const schemaWithPermissions = applyMiddleware(schema, permissions);

const server = new ApolloServer({
  schema: schemaWithPermissions,
  dataSources: () => ({ db }),
  context: ({req}) => {
    const user = req.user || null;
    return { user };
  },
  plugins: [cookieHeaderPlugin]
});

await server.start();

server.applyMiddleware({ app, cors: false });

app.listen({ port }, () =>
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
);
