const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuidv4").default;
const AWS = require("aws-sdk");
const {
  config,
  userTypes,
  getUserByMail,
  s3Bucket,
  postImageBD,
  createUserBD,
  registerTourBD,
  getUserAuth
} = require("../utils");

async function signup(_, args) {
  var password;
  await bcrypt.hash(args.password, 10).then(hash => {
    password = hash;
  });
  const userId = uuid();
  const user = await createUserBD({ ...args, password, userId });
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

async function login(_, args) {
  const user = await getUserByMail(args.email);
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


async function registerTour(_, args, context) {
  const user = getUserAuth(context);
  if (user.user.type === userTypes.customer) {
    throw new Error("User not authorized");
  } else {
    const newTour = {
      tourId: uuid(),
      name: args.name,
      price: args.price,
      startDate: args.startDate,
      endDate: args.endDate,
      type: args.type,
      createdAt: new Date().toString(),
      createdBy: user.user
    };
    const tour = await registerTourBD(newTour);
    if (tour) {
      return tour;
    } else {
      throw new Error("Internal Server Error (500)");
    }
  }
}

async function registerImage(_, args, context) {
  const user = getUserAuth(context);
  if (user.user.type === userTypes.customer) {
    throw new Error("User not authorized");
  } else {
    const newImage = {
      tourPhotoId: uuid(),
      url: args.url
    };
    const image = await postImageBD(newImage);
    if (image) {
      return image;
    } else {
      throw new Error("Internal Server Error (500)");
    }
  }
}

async function uploadToS3(_, args, context) {
  const user = getUserAuth(context);
  if (user.user.type === userTypes.customer) {
    throw new Error("User not authorized");
  } else {
    const s3 = new AWS.S3({
      signatureVersion: "v4",
      region: "us-east-1"
    });

    const s3Params = {
      Bucket: s3Bucket,
      Key: args.filename,
      Expires: 60,
      ContentType: args.filetype,
      ACL: "public-read"
    };

    const signedRequest = await s3.getSignedUrl("putObject", s3Params);
    const url = `https://${s3Bucket}.s3.amazonaws.com/${args.filename}`;

    return {
      signedRequest,
      url
    };
  }


module.exports = {
  signup,
  login,
  uploadToS3,
  registerTour,
  registerImage
};
