const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const promisify = require("./promisify");

const config = {
  APP_SECRET: "GraphQL-is-aw3some",
  TOKEN_LIFE: "1d",
  NOT_BEFORE: "2000",
  ALGORITHM: "HS256"
};

dynamoDb = new AWS.DynamoDB.DocumentClient();

const createUserBD = user =>
  promisify(callback =>
    dynamoDb.put(
      {
        TableName: process.env.USER_TABLE,
        Item: {
          userId: user.userId,
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
      throw new Error(error);
    });

const getUserByMail = email =>
  promisify(callback =>
    dynamoDb.scan(
      {
        TableName: process.env.USER_TABLE,
        ProjectionExpression: "#n, userId, #p, #e",
        FilterExpression: "#e = :var",
        ExpressionAttributeNames: {
          "#n": "name",
          "#p": "password",
          "#e": "email"
        },
        ExpressionAttributeValues: { ":var": email }
      },
      callback
    )
  )
    .then(result => {
      if (!result.Items) {
        return userId;
      }
      return result.Items[0];
    })
    .catch(error => {
      throw new Error(error);
    });

function getUserIdAuth(context) {
  const Authorization = context.headers.Authorization || "";
  if (Authorization) {
    var token = Authorization.replace("Bearer ", "");
    token = token.substring(1);
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

module.exports = {
  config,
  createUserBD,
  getUserByMail,
  getUserIdAuth
};
