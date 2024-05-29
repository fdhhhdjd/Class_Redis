//* LIB
const IOREDIS = require("ioredis");
const {
  redis: { host, port, user, password },
} = require("../commons/configs/redis.config");

class RedisClient {
  constructor() {
    this.redisInstance = new IOREDIS({
      port,
      host,
      user,
      password,
    });

    this.redisInstance.on("connect", () => {
      console.log("CONNECTED TO REDIS SUCCESS 🥅!!");
    });

    this.redisInstance.on("error", (error) => {
      console.error(`Error connecting to Redis server: ${error.message}`);
    });
  }
}

module.exports = new RedisClient().redisInstance;
