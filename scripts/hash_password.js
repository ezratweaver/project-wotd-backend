const { hashSync } = require("bcrypt");

const passwordFromArgs = process.argv[2];

if (!passwordFromArgs) {
  throw new Error(
    "Missing password args. Try: node hash_password.js <Password>",
  );
}

const hashedPassword = hashSync(passwordFromArgs, 10);

console.log(hashedPassword);
