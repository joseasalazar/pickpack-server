const { ApolloServer } = require("apollo-server-lambda");
const typeDefs = require("./src/schema");
const resolvers = require("./src/resolvers");
// const Mutation = require("./src/resolvers/Mutation");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

// const resolvers = {
//   Mutation
// };

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

// The `listen` method launches a web server.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });

exports.graphql = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});
