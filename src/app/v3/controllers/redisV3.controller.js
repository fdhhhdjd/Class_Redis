//* IMPORT
const { SuccessResponse } = require("../../../cores/success.response");
const redisV3Service = require("../services/redisV3.service");

class RedisV3Controller {
  //* Bloom
  async bloomFilter(req, res, ___) {
    const { username } = req.query;
    new SuccessResponse({
      metadata: await redisV3Service.bloomFilter(username),
    }).send(res);
  }

  //* Cuckoo
  async cuckooFilter(req, res, ___) {
    const { username } = req.query;
    new SuccessResponse({
      metadata: await redisV3Service.cuckooFilter(username),
    }).send(res);
  }

  async cuckooDeleteUser(req, res, ___) {
    const { username } = req.query;
    new SuccessResponse({
      metadata: await redisV3Service.cuckooDeleteUser(username),
    }).send(res);
  }

  //* TOP-K
  async addValue(req, res, ___) {
    const { username } = req.query;
    new SuccessResponse({
      metadata: await redisV3Service.addValue(username),
    }).send(res);
  }

  async getCount(req, res, ___) {
    const { username } = req.query;
    new SuccessResponse({
      metadata: await redisV3Service.getCount(username),
    }).send(res);
  }

  async getTopK(req, res, ___) {
    const { username } = req.query;
    new SuccessResponse({
      metadata: await redisV3Service.getTopK(username),
    }).send(res);
  }

  //* Count-Min Sketch
  async addValueText(req, res, ___) {
    const { text } = req.body;
    new SuccessResponse({
      metadata: await redisV3Service.addValueText(text),
    }).send(res);
  }

  async getCountText(req, res, ___) {
    const { text } = req.query;
    new SuccessResponse({
      metadata: await redisV3Service.getCountText(text),
    }).send(res);
  }
}

module.exports = new RedisV3Controller();
