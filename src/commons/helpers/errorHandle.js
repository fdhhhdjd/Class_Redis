//* IMPORT
const logger = require("../../loggers/winston.log");
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

const errorHandler = (error, checkNodeApp) => {
  const statusCode = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

  const response = {
    message,
    status: statusCode,
  };

  if (checkNodeApp) {
    Object.assign(response, { stack: error.stack });
  }

  logger.error(`${response.status} = ${response.message} = ${response.stack}`);
  return { response };
};

module.exports = { errorHandler };
