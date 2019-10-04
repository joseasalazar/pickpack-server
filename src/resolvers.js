// Resolvers define the technique for fetching the types defined in the schema
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const Mutation = require("./resolvers/Mutation");

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`
  },
  Mutation
};

module.exports = resolvers;
