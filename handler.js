const { ApolloServer } = require("apollo-server-lambda");
const typeDefs = require("./src/schema");
const resolvers = require("./src/resolvers");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context
  })
});

exports.graphql = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});
