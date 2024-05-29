//* IMPORT
const { SuccessResponse } = require("../../../cores/success.response");
const redisV3Service = require("../services/redisV3.service");

class RedisV3Controller {
  async bloomFilter(req, res, ___) {
    const { username } = req.query;
    new SuccessResponse({
      metadata: await redisV3Service.bloomFilter(username),
    }).send(res);
  }

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
}

module.exports = new RedisV3Controller();
