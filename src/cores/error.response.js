"use strict";

//* IMPORT
const {
  StatusCodes,
  ReasonPhrases,
} = require("../commons/utils/httpStatusCode");
// const logger = require("../loggers/winston.log");
const myLogger = require("../loggers/mylogger.log");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.now = Date.now();

    // logger.error(`${this.status} = ${this.message}`);
    // myLogger.error(this.message, {
    //   context: "/path",
    //   requestId: "uuaaaa",
    //   message: this.message,
    //   metadata: {},
    // });
    // myLogger.error(this.message, [
    //   "/api/v1/messages",
    //   "123123123",
    //   { error: "Bad request" },
    // ]);
  }
}
class BadRequestRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class GoneError extends ErrorResponse {
  constructor(message = ReasonPhrases.GONE, statusCode = StatusCodes.GONE) {
    super(message, statusCode);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}
module.exports = {
  BadRequestRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  GoneError,
};
