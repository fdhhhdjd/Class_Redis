"use strict";

//* LIB
const { format, createLogger, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const { v4: uuid } = require("uuid");

const logsDirectory = path.join(__dirname, "../logs");

class MyLogger {
  constructor() {
    const formatPrint = format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp} - ${level} - ${context} - ${requestId} - ${message} - ${JSON.stringify(
          metadata
        )}`;
      }
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        formatPrint
      ),
      transports: [
        new transports.Console(),
        new DailyRotateFile({
          dirname: logsDirectory,
          filename: "app-%DATE%.info.log",
          // datePattern: "YYYY-MM-DD-HH-mm",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
          level: "info",
        }),
        new DailyRotateFile({
          dirname: logsDirectory,
          filename: "app-%DATE%.error.log",
          // datePattern: "YYYY-MM-DD-HH-mm",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
          level: "error",
        }),
      ],
    });
  }

  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }
    const requestId = req?.requestId || uuid();
    return {
      requestId,
      context,
      metadata,
    };
  }

  log(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramLog
    );
    this.logger.info(logObject);
  }

  error(message, params) {
    const paramLog = this.commonParams(params);

    const logObject = Object.assign(
      {
        message,
      },
      paramLog
    );
    this.logger.error(logObject);
  }
}

module.exports = new MyLogger();
