//* IMPORT
const app = require("./src/app");
const {
  app: { port: PORT },
} = require("./src/commons/configs/app.config");
const logger = require("./src/loggers/winston.log");

const server = app.listen(PORT, () => {
  console.info(`💸 Api backend start with http://localhost:${PORT} 🔥`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception thrown: ${error.message}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`Exit Server Express`));
});
