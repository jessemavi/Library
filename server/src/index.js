import { ApolloServer } from "apollo-server";

import Database from "./dataSources/Database.js";
import resolvers from "./graphql/resolvers.js";
import typeDefs from "./graphql/typeDefs.js";

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ db })
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
