//* LIB
const _ = require("lodash");
const axios = require("axios");

//* IMPORT
const redisModel = require("../models/redis.model");
// const redisPub = require("../../../databases/init.pub");
const redisInstance = require("../../../databases/init.redis");
const { SaveDataHashObject } = require("../../../commons/keys/save");
const { UserExit } = require("../../../commons/keys/sub");
const { countKey, profileKey } = require("../../../commons/keys/transaction");

class RedisService {
  async pub() {
    const data = {
      id: "id",
      name: "name",
    };
    // redisPub.publish(UserExit, JSON.stringify(data));
    return data;
  }
  async saveData() {
    const resultData = await redisModel.save();
    if (resultData) {
      redisInstance.del(SaveDataHashObject);
    }
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

  async batchSize() {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const todos = response.data;

      const pipeline = redisInstance.pipeline();

      todos.forEach((todo) => {
        const todoKey = `todo:${todo.id}`;
        pipeline.hmset(todoKey, todo);
      });

      await pipeline.exec();

      return "Pipeline completed successfully";
    } catch (error) {
      console.error("Transaction failed:", error.message);
    }
  }

  async transaction() {
    const profile = {
      full_name: "Nguyen Tien Tai",
      age: 24,
      job: "Teacher and Developer",
    };
    const profileFlat = Object.entries(profile).flatMap(([key, value]) => [
      key,
      value,
    ]);

    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const todos = response.data;

      // started a transaction
      let transaction = redisInstance.multi();

      // add mutilp
      todos.forEach((todo) => {
        const todoKey = `todo:${todo.id}`;
        transaction.hmset(todoKey, todo);
      });

      transaction.set(countKey, 1);
      transaction.hmset(profileKey, ...profileFlat);

      // perform all transaction
      const result = await transaction.exec();

      console.log("Transaction completed successfully");
      return "Transaction completed successfully";
    } catch (error) {
      console.error("Transaction failed:", error.message);
      throw error;
    }
  }

  async getAllDataHashFromRedis() {
    try {
      const keys = await redisInstance.keys("todo:*");

      const pipeline = redisInstance.pipeline();
      keys.forEach((key) => {
        pipeline.hgetall(key);
      });

      const results = await pipeline.exec();
      const data = results.map(([_, result]) => result);

      return data;
    } catch (error) {
      return null;
    }
  }

  async spamUser() {
    const key = "spam_user", // Key spam of every user
      blockDuration = 3 * 60, // We will block it into 3 minutes
      delDuration = 10, // Delete when user login normally
      maxRequest = 3; // Max request per minute

    // It will yet increment when user request to link api
    const numberRequest = await redisInstance.incr(key);

    let _ttl;
    const addExpireKeyBlock = numberRequest === maxRequest + 1;

    if (addExpireKeyBlock) {
      redisInstance.expire(key, blockDuration);
      _ttl = blockDuration;
    } else {
      // Get time ttl of key
      _ttl = await redisInstance.ttl(key);
    }

    // If user request to link api more than 3 times block user in 3 minutes
    if (numberRequest > maxRequest) {
      return `You are blocked by ${_ttl}s thank you`;
    }

    redisInstance.expire(key, delDuration);

    return "Ok";
  }
}

module.exports = new RedisService();
