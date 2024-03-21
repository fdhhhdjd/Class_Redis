//* IMPORT
const { SuccessResponse, Created } = require("../../../cores/success.response");
const redisV2Service = require("../services/redisV2.service");

class RedisV2Controller {
  async hyperLogLog(req, res, ___) {
    new SuccessResponse({
      metadata: await redisV2Service.hyperLogLog(req.body),
    }).send(res);
  }
  async infoHyperLogLog(_, res, ___) {
    new SuccessResponse({
      metadata: await redisV2Service.infoHyperLogLog(),
    }).send(res);
  }
  async geoSpatial(_, res, ___) {
    new SuccessResponse({
      metadata: await redisV2Service.geoSpatial(),
    }).send(res);
  }
}

module.exports = new RedisV2Controller();
