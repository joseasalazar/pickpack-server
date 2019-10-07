const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuidv4").default;
const {
  config,
  getUserByMail,
  createUserBD,
  registerTourBD,
  getUserIdAuth
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
  const user = getUserIdAuth(context);
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
    return true;
  } else {
    throw new Error("Internal Server Error (500)");
  }
}

function post(_, args, context) {
  const user = getUserIdAuth(context);
  const link = {
    id: uuid(),
    description: args.description,
    url: args.url,
    postedBy: user.user
  };
  // links.push(link);
  return link;
}

module.exports = {
  signup,
  login,
  registerTour,
  post
};
