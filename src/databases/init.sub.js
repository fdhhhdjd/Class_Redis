//* LIB
const IOREDIS = require("ioredis");

//* IMPORT
const { isValidJSON } = require("../commons/utils/convert");
const {
  redis: { host, port, user, password },
} = require("../commons/configs/redis.config");

class RedisSub {
  constructor() {
    this.redisClient = new IOREDIS({
      port,
      host,
      user,
      password,
    });

    this.channelHandlers = new Map();
  }

  async initializeSubscriptions(channels) {
    this.redisClient.on("ready", async () => {
      try {
        channels.forEach((channel) => {
          this.redisClient.psubscribe(channel);
        });
        console.info(`Redis subscribed to channels: ${channels.join(", ")}`);
      } catch (error) {
        console.error("Failed to subscribe to Redis channels:", error);
      }
    });

    this.redisClient.on("pmessage", async (pattern, channel, message) => {
      console.info(pattern, "::::::::pattern");
      const handler = this.channelHandlers.get(pattern);
      if (handler) {
        if (isValidJSON(message)) {
          try {
            const parsedMessage = JSON.parse(message);
            handler(parsedMessage);
          } catch (error) {
            console.error(
              `Error processing Redis message on channel ${channel}:`,
              error
            );
          }
        } else {
          console.error(
            `Invalid JSON message received on channel ${channel}:`,
            message
          );
        }
      }
    });
  }

  registerHandler(channel, handler) {
    this.channelHandlers.set(channel, handler);
  }

  publish(channel, message) {
    this.redisClient.publish(channel, JSON.stringify(message));
  }
}

module.exports = new RedisSub();
