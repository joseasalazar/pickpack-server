const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const promisify = require("./promisify");

const config = {
  APP_SECRET: "GraphQL-is-aw3some",
  TOKEN_LIFE: "1d",
  NOT_BEFORE: "2000",
  ALGORITHM: "HS256"
};

const userTypes = {
  admin: "sSc3sSkWVAcnAFA6nf/N6A==",
  customer: "/eCXmXakLrDc8BHabm+gAw==",
  provider: "yewblyw4X+tPevioSPgGAA=="
};

const s3Bucket = "pickpack-tours-images";

dynamoDb = new AWS.DynamoDB.DocumentClient();

//GETS
const getTours = () =>
  promisify(callback =>
    dynamoDb.scan(
      {
        TableName: process.env.TOUR_TABLE
      },
      callback
    )
  )
    .then(result => result.Items)
    .catch(error => {
      throw new Error(error);
    });

const getUserByMail = email =>
  promisify(callback =>
    dynamoDb.scan(
      {
        TableName: process.env.USER_TABLE,
        ProjectionExpression: "#n, userId, #p, #e, #b, #c, #co, #g, #t",
        FilterExpression: "#e = :var",
        ExpressionAttributeNames: {
          "#n": "name",
          "#p": "password",
          "#e": "email",
          "#b": "birthDate",
          "#c": "city",
          "#co": "country",
          "#g": "gender",
          "#t": "type"
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

const getTourByNameBD = name =>
  promisify(callback =>
    dynamoDb.scan(
      {
        TableName: process.env.TOUR_TABLE,
        ProjectionExpression:
          "tourId, #n, #p, #da, #c, #cp, #d, #sd, #ed, #t, #q, #s, #ph, #ca. #cb",
        FilterExpression: "#n = :var",
        ExpressionAttributeNames: {
          "#n": "name",
          "#p": "price",
          "#da": "daysAvailable",
          "#c": "clasification",
          "#cp": "cancellationPolicy",
          "#d": "discount",
          "#sd": "startDate",
          "#ed": "endDate",
          "#t": "type",
          "#q": "quantity",
          "#s": "status",
          "#ph": "photo",
          "#ca": "createdAt",
          "#cb": "createdBy"
        },
        ExpressionAttributeValues: { ":var": name }
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

//CREATES
const postImageBD = tourPhoto =>
  promisify(callback =>
    dynamoDb.put(
      {
        TableName: process.env.TOUR_PHOTO_TABLE,
        Item: {
          tourPhotoId: tourPhoto.tourPhotoId,
          url: tourPhoto.url
        },
        ConditionExpression: "attribute_not_exists(#i)",
        ExpressionAttributeNames: { "#i": "tourPhotoId" },
        ReturnValues: "ALL_OLD"
      },
      callback
    )
  )
    .then(result => tourPhoto)
    .catch(error => {
      throw new Error(error);
    });

const createUserBD = user =>
  promisify(callback =>
    dynamoDb.put(
      {
        TableName: process.env.USER_TABLE,
        Item: {
          userId: user.userId,
          password: user.password,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          type: user.type,
          birthDate: user.birthDate,
          gender: user.gender,
          city: user.city,
          country: user.country,
          createdAt: new Date().toString()
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

const registerTourBD = tour =>
  promisify(callback =>
    dynamoDb.put(
      {
        TableName: process.env.TOUR_TABLE,
        Item: {
          tourId: tour.tourId,
          name: tour.name,
          price: tour.price,
          startDate: tour.startDate,
          endDate: tour.endDate,
          type: tour.type,
          createdAt: tour.createdAt,
          createdBy: tour.createdBy
        },
        ConditionExpression: "attribute_not_exists(#t)",
        ExpressionAttributeNames: { "#t": "tourId" },
        ReturnValues: "ALL_OLD"
      },
      callback
    )
  )
    .then(result => tour)
    .catch(error => {
      throw new Error(error);
    });

//AUTHENTICATION
function getUserAuth(context) {
  const Authorization = context.headers.Authorization || "";
  if (Authorization) {
    var token = Authorization.replace("Bearer ", "");
    // throw new Error(token);
    var user;
    jwt.verify(token, config.APP_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new Error("Expired Token");
        } else {
          throw new Error(err);
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
  userTypes,
  s3Bucket,
  getTours,
  getUserByMail,
  postImageBD,
  createUserBD,
  registerTourBD,
  getTourByNameBD,
  getUserAuth
};
