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
  // engine: {
  //   apiKey: "service:pick-pack-server:VC5fORxeDc1jnkzkQsuQzw",
  //   schemaTag: "production"
  // }
});

// The `listen` method launches a web server.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});
