import { GraphQLServer } from 'graphql-yoga';
import { makeExecutableSchema } from 'graphql-tools';
import { importSchema } from 'graphql-import';
import { prisma } from './generated/prisma-client';
import { resolvers } from './resolvers';

const typeDefs = importSchema('./src/schema.graphql');

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new GraphQLServer({
  schema,
  context: (request) => ({
    ...request,
    prisma,
  }),
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
