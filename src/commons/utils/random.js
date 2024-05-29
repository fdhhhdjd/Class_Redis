//* LIB
const crypto = require("crypto");

//* IMPORT
const {
  app: { radomPassword },
} = require("../../commons/configs/app.config");

const generateRandomString = (length = 10) => {
  const charsetLength = radomPassword.length;

  const password = Array.from({ length }, () =>
    radomPassword.charAt(Math.floor(Math.random() * charsetLength))
  ).join("");

  return password;
};
const generateRandomLink = (length) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (ex, buf) => {
      if (ex) {
        reject(ex);
      } else {
        resolve(buf.toString("hex"));
      }
    });
  });
};

const generateRandomUsername = () => {
  const randomNumber = Math.floor(Math.random() * 10000) + 1;
  const username = "User" + randomNumber;
  return username;
};

module.exports = {
  generateRandomString,
  generateRandomLink,
  generateRandomUsername,
};
