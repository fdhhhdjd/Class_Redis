//* LIb
const winston = require("winston");
const { combine, timestamp, printf } = winston.format;
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

//* IMPORT
const {
  app: { node, log },
} = require("../commons/configs/app.config");
const { NODE_ENV } = require("../commons/constants");

const logFormat = printf((info) => {
  return `[${info.timestamp}] [${info.level.toUpperCase()}] [${node}] ${
    info.message
  }`;
});

const logsDirectory = path.join(__dirname, "../logs");

const isProduct = node === NODE_ENV.PRO;
const logger = winston.createLogger({
  level: isProduct ? log : "debug",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      dirname: logsDirectory,
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

module.exports = logger;
