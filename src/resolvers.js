// Resolvers define the technique for fetching the types defined in the schema
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");

const resolvers = {
  Query,
  Mutation
};

module.exports = resolvers;
