// Resolvers define the technique for fetching the types defined in the schema
const bcrypt = require("bcryptjs");

async function createUser(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  console.log(args, password);
  console.log(context);
  return true;
  // const user = await createUser(...args);
  // const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // return {
  //   token,
  //   user
  // };
}

module.exports = createUser;
