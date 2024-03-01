//* LIB
const IOREDIS = require("ioredis");

//* IMPORT
const {
  redis: { host, port, user, password },
} = require("../commons/configs/redis.config");

class RedisPublisher {
  constructor() {
    this.redisClient = new IOREDIS({
      port,
      host,
      user,
      password,
    });
  }

  publish(channel, message) {
    this.redisClient.publish(channel, JSON.stringify(message));
  }
}

module.exports = new RedisPublisher();
