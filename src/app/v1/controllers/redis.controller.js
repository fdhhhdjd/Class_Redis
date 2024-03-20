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

  async transaction(_, res, ___) {
    new SuccessResponse({
      metadata: await redisService.transaction(),
    }).send(res);
  }
  async batchSize(_, res, ___) {
    new SuccessResponse({
      metadata: await redisService.batchSize(),
    }).send(res);
  }
  async getAllDataHashFromRedis(_, res, ___) {
    new SuccessResponse({
      metadata: await redisService.getAllDataHashFromRedis(),
    }).send(res);
  }

  async spamUser(_, res, ___) {
    new SuccessResponse({
      metadata: await redisService.spamUser(),
    }).send(res);
  }
}

module.exports = new RedisController();
