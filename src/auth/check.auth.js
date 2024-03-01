//* LIB
const _ = require("lodash");
const { UnauthorizedError, NotFoundError } = require("../cores/error.response");
const { verifyTokenJWT } = require("./auth.token");

//* IMPORT
const {
  app: { accessKey },
} = require("../commons/configs/app.config");
const { TOKEN_EXPIRE, INVALID_TOKEN, ROLE } = require("../commons/constants");
const { isTokenBlacklisted } = require("./auth.blacklist");

const checkAuthorizationAccessToken = async (req, __, next) => {
  try {
    const accessToken = req.headers?.authorization?.split(" ")[1];
    const refetchToken = req?.cookies?.refresh_token;

    if (_.isEmpty(accessToken) || _.isEmpty(refetchToken)) {
      next(new UnauthorizedError());
    }

    const infoToken = await verifyTokenJWT(accessToken, accessKey);

    const checkToken = [TOKEN_EXPIRE, INVALID_TOKEN].includes(infoToken);

    if (checkToken) {
      next(new UnauthorizedError());
    }

    const isBlacklisted = await isTokenBlacklisted(refetchToken);

    if (isBlacklisted) {
      next(new UnauthorizedError("Token is not blacklisted"));
    }

    req.userInfo = infoToken;
    req.accessToken = accessToken;

    next();
  } catch (error) {
    next(new NotFoundError(error));
  }
};

const checkRoleAdmin = async (req, __, next) => {
  if (req.userInfo.role !== ROLE.ADMIN) {
    next(new UnauthorizedError());
  }
  next();
};

module.exports = {
  checkAuthorizationAccessToken,
  checkRoleAdmin,
};
