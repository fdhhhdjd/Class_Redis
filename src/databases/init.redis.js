//* LIB
const IOREDIS = require("ioredis");

class RedisClient {
  constructor() {
    const {
      redis: { host, port, user, password },
    } = require("../commons/configs/redis.config");

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
