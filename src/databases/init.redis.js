//* LIB
const IOREDIS = require("ioredis");

//* IMPORT
const {
  redis: { host, port, user, password },
} = require("../commons/configs/redis.config");

const redisInstance = new IOREDIS({
  port,
  host,
  user,
  password,
});

redisInstance.on("connect", () => {
  console.log("CONNECTED TO REDIS SUCCESS 🥅!!");
});

redisInstance.on("error", (error) => {
  console.error(`Error connecting to Redis server: ${error.message}`);
});

module.exports = redisInstance;
