//* LIB
const bcrypt = require("bcrypt");

//* IMPORT
const { SALT_ROUNDS } = require("../commons/constants");

const encodePassword = async (password) => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    error.message;
  }
};

const comparePassword = async (passwordText, passwordHash) => {
  try {
    console.log(passwordText, passwordHash);
    return await bcrypt.compare(passwordText, passwordHash);
  } catch (error) {
    error.message;
  }
};

module.exports = { encodePassword, comparePassword };
