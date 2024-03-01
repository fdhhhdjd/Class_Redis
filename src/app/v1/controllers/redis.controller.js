//* IMPORT
const { SuccessResponse } = require("../../../cores/success.response");
const redisService = require("../services/redis.service");

class RedisController {
  async pub(_, res, ___) {
    new SuccessResponse({
      metadata: await redisService.pub(),
    }).send(res);
  }
}

module.exports = new RedisController();
