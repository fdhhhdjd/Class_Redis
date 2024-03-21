//* IMPORT
// const redisPub = require("../../../databases/init.pub");
const redisInstance = require("../../../databases/init.redis");

class RedisV2Service {
  async hyperLogLog() {
    const key = "event_registrations";
    const registeredUsers = [
      "user1",
      "user2",
      "user3",
      "user4",
      "user1",
      "user5",
      "user6",
    ];

    await redisInstance.pfadd(key, ...registeredUsers);

    await redisInstance.pfadd("users-app2", "user1", "user3");

    await redisInstance.pfmerge(
      "users-new",
      "event_registrations",
      "users-app2"
    );
    return "OK";
  }
  async infoHyperLogLog() {
    const key = "event_registrations";
    const resultEvent = await redisInstance.pfcount(key);
    const dataType = await redisInstance.type(key);
    return {
      result: resultEvent,
      typeRedis: dataType,
    };
  }
}

module.exports = new RedisV2Service();
