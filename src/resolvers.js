// Resolvers define the technique for fetching the types defined in the schema
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const tours = [
  {
    tourId: 28902,
    tourName: "XEL-HA",
    tourPrice: 200,
    tourDiscount: 0,
    tourStartDate: new Date(),
    tourEndDate: new Date(),
    tourType: "",
    tourQuantity: 0,
    tourStatus: 2,
    tourPhoto: []
  }
];

const resolvers = {
  Query: {
    tours: () => tours
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  })
};

module.exports = resolvers;
