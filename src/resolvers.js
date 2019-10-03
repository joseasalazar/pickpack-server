// Resolvers define the technique for fetching the types defined in the schema
const AWS = require("aws-sdk");
const promisify = require("./promisify");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuidv4").default;

const config = {
  APP_SECRET: "GraphQL-is-aw3some",
  TOKEN_LIFE: "1d",
  NOT_BEFORE: "2000",
  ALGORITHM: "HS256"
};

dynamoDb = new AWS.DynamoDB.DocumentClient();

// const resolvers = {
//   Query: {
//     user: (_, { userId }) => getUser(userId)
//   },
//   Mutation: {
//     createUser: (_, { email }) => createUser(email),
//     updateUser: (_, { userId, country }) => updateUser(userId, country)
//   }
//   // Date: new GraphQLScalarType({
//   //   name: "Date",
//   //   description: "Date custom scalar type",
//   //   parseValue(value) {
//   //     return new Date(value); // value from the client
//   //   },
//   //   serialize(value) {
//   //     return value.getTime(); // value sent to the client
//   //   },
//   //   parseLiteral(ast) {
//   //     if (ast.kind === Kind.INT) {
//   //       return parseInt(ast.value, 10); // ast value is always in string format
//   //     }
//   //     return null;
//   //   }
//   // })
// };

// const createUser = email =>
//   promisify(callback =>
//     dynamoDb.put(
//       {
//         TableName: process.env.USER_TABLE,
//         Item: {
//           userId: crypto
//             .createHash("md5")
//             .update(email)
//             .digest("hex")
//             .toString(),
//           email: email
//         },
//         ConditionExpression: "attribute_not_exists(#u)",
//         ExpressionAttributeNames: { "#u": "userId" },
//         ReturnValues: "ALL_OLD"
//       },
//       callback
//     )
//   )
//     .then(result => true)
//     .catch(error => {
//       console.log(error);
//       return false;
//     });

// const getUser = userId =>
//   promisify(callback =>
//     dynamoDb.get(
//       {
//         TableName: process.env.USER_TABLE,
//         Key: { userId }
//       },
//       callback
//     )
//   )
//     .then(result => {
//       if (!result.Item) {
//         return userId;
//       }
//       return result.Item;
//     })
//     .catch(error => console.error(error));

// const updateUser = (userId, country) =>
//   promisify(callback =>
//     dynamoDb.update(
//       {
//         TableName: process.env.USER_TABLE,
//         Key: { userId },
//         UpdateExpression: "SET #foo = :bar",
//         ExpressionAttributeNames: { "#foo": "country" },
//         ExpressionAttributeValues: { ":bar": country },
//         ReturnValues: "ALL_NEW"
//       },
//       callback
//     )
//   )
//     .then(result => result.Attributes)
//     .catch(error => console.log(error));

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    users: () => users
  },
  Mutation: {
    post: (_, args, context) => post(args, context),
    signup: (_, args) => signup(args),
    createUser: (_, args) => createUserBD(args),
    login: (_, args) => login(args)
  }
};

const createUserBD = user =>
  promisify(callback =>
    dynamoDb.put(
      {
        TableName: process.env.USER_TABLE,
        Item: {
          userId: uuid(),
          password: user.password,
          name: user.name,
          email: user.email
        },
        ConditionExpression: "attribute_not_exists(#u)",
        ExpressionAttributeNames: { "#u": "userId" },
        ReturnValues: "ALL_OLD"
      },
      callback
    )
  )
    .then(result => user)
    .catch(error => {
      console.log(error);
      return false;
    });

function post(args, context) {
  const user = getUserId(context);
  const link = {
    id: uuid(),
    description: args.description,
    url: args.url,
    postedBy: user.user
  };
  links.push(link);
  return link;
}

async function signup(args) {
  var password;
  await bcrypt.hash(args.password, 10).then(hash => {
    password = hash;
  });
  const user = await createUserBD({ ...args, password });
  if (user) {
    const token = jwt.sign(
      {
        user: user
      },
      config.APP_SECRET,
      {
        algorithm: config.ALGORITHM,
        expiresIn: config.TOKEN_LIFE,
        notBefore: config.NOT_BEFORE
      }
    );

    return {
      token,
      user
    };
  } else {
    throw new Error("Internal Server Error (500)");
  }
}

async function login(args) {
  const user = users.find(user => user.email === args.email);
  if (!user) {
    throw new Error("No such user found");
  }
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    {
      user: user
    },
    config.APP_SECRET,
    {
      algorithm: config.ALGORITHM,
      expiresIn: config.TOKEN_LIFE,
      notBefore: config.NOT_BEFORE
    }
  );

  return {
    token,
    user
  };
}

function getUserId(context) {
  const Authorization = context.headers.authorization || "";
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    var user;
    jwt.verify(token, config.APP_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new Error("Expired Token");
        } else {
          throw new Error("Authentication Token Error");
        }
      } else {
        user = decoded;
      }
    });
    return user;
  }

  throw new Error("Not authenticated");
}

module.exports = resolvers;

module.exports = resolvers;
