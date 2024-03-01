//* LIB
const JWT = require("jsonwebtoken");

const createTokenJWT = (user, secret, timeExpire) => {
  try {
    return JWT.sign(user, secret, {
      expiresIn: timeExpire,
    });
  } catch (error) {
    return error.message;
  }
};

const verifyTokenJWT = async (token, secret) => {
  try {
    return await JWT.verify(token, secret);
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  verifyTokenJWT,
  createTokenJWT,
};
