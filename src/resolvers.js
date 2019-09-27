// Resolvers define the technique for fetching the types defined in the schema
const AWS = require("aws-sdk");
const promisify = require("./promisify");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const crypto = require("crypto");

dynamoDb = new AWS.DynamoDB.DocumentClient();

const resolvers = {
  Query: {
    user: (_, { ID }) => getUser(ID)
  },
  Mutation: {
    createUser: (_, { email }) => createUser(email),
    updateUser: (_, { ID, country }) => updateUser(ID, country)
  }
  // Date: new GraphQLScalarType({
  //   name: "Date",
  //   description: "Date custom scalar type",
  //   parseValue(value) {
  //     return new Date(value); // value from the client
  //   },
  //   serialize(value) {
  //     return value.getTime(); // value sent to the client
  //   },
  //   parseLiteral(ast) {
  //     if (ast.kind === Kind.INT) {
  //       return parseInt(ast.value, 10); // ast value is always in string format
  //     }
  //     return null;
  //   }
  // })
};

const createUser = email =>
  promisify(callback =>
    dynamoDb.put(
      {
        TableName: process.env.USER_TABLE,
        Item: {
          ID: crypto
            .createHash("md5")
            .update(email)
            .digest("hex")
            .toString(),
          email: email
        },
        ConditionExpression: "attribute_not_exists(#u)",
        ExpressionAttributeNames: { "#u": "ID" },
        ReturnValues: "ALL_OLD"
      },
      callback
    )
  )
    .then(result => true)
    .catch(error => {
      console.log(error);
      return false;
    });

const getUser = ID =>
  promisify(callback =>
    dynamoDb.get(
      {
        TableName: process.env.USER_TABLE,
        Key: { ID }
      },
      callback
    )
  )
    .then(result => {
      if (!result.Item) {
        return ID;
      }
      return result.Item;
    })
    .catch(error => console.error(error));

const updateUser = (ID, country) =>
  promisify(callback =>
    dynamoDb.update(
      {
        TableName: process.env.USER_TABLE,
        Key: { ID },
        UpdateExpression: "SET #foo = :bar",
        ExpressionAttributeNames: { "#foo": "country" },
        ExpressionAttributeValues: { ":bar": country },
        ReturnValues: "ALL_NEW"
      },
      callback
    )
  )
    .then(result => result.Attributes)
    .catch(error => console.log(error));

module.exports = resolvers;
