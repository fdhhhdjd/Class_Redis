//* LIB
const _ = require("lodash");

//* IMPORT
const {
  app: { node },
} = require("../commons/configs/app.config");
const { NODE_ENV, TIME_COOKIE } = require("../commons/constants");
const { BadRequestRequestError } = require("../cores/error.response");

const createCookie = (res, key, value, options = {}) => {
  try {
    const isOptionsEmpty = _.isEmpty(options);
    if (isOptionsEmpty) {
      const isProduction = node === NODE_ENV.PRO;
      Object.assign(options, {
        httpOnly: isProduction,
        sameSite: isProduction,
        secure: isProduction,
        maxAge: TIME_COOKIE._7_DAY,
      });
    }

    res.cookie(key, value, options);
  } catch (error) {
    throw new BadRequestRequestError(error);
  }
};

module.exports = {
  createCookie,
};
