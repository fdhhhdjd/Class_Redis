//* LIB
const _ = require("lodash");

//* IMPORT
const redisModel = require("../models/redis.model");
const redisPub = require("../../../databases/init.pub");
const redisInstance = require("../../../databases/init.redis");
const { SaveDataHashObject } = require("../../../commons/keys/save");
const { UserExit } = require("../../../commons/keys/sub");

class RedisService {
  async pub() {
    const data = {
      id: "id",
      name: "name",
    };
    redisPub.publish(UserExit, JSON.stringify(data));
    return data;
  }
  async saveData() {
    const resultData = await redisModel.save();

    redisInstance.del(SaveDataHashObject);

    return resultData;
  }

  async getData() {
    const userData = await redisInstance.hgetall(SaveDataHashObject);

    const checkUseDataExist = !_.isEmpty(userData);

    if (checkUseDataExist) {
      console.log("Get Redis");
      return userData;
    }

    const resultData = await redisModel.getAll();
    console.log("Get Database");

    const redisData = Object.entries(resultData).flatMap(([key, value]) => [
      key,
      value,
    ]);

    redisInstance.hmset(SaveDataHashObject, ...redisData);
    return resultData;
  }
}

module.exports = new RedisService();
