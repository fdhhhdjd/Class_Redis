//* IMPORT
const { SuccessResponse, Created } = require("../../../cores/success.response");
const redisService = require("../services/redis.service");

class RedisController {
  async getData(_, res, ___) {
    new SuccessResponse({
      metadata: await redisService.getData(),
    }).send(res);
  }
  async saveData(_, res, ___) {
    new Created({
      metadata: await redisService.saveData(),
    }).send(res);
  }
  async pub(_, res, ___) {
    new SuccessResponse({
      metadata: await redisService.pub(),
    }).send(res);
  }
}

module.exports = new RedisController();
