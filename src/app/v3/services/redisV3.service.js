//* IMPORT
const { generateRandomUsername } = require("../../../commons/utils/random");
const redisInstance = require("../../../databases/init.redis");

class RedisV3Service {
  constructor() {
    this.keyBloom = "keyBloom";
    this.keyCuckoo = "keyCuckoo";
  }

  async init() {
    await redisInstance.send_command("BF.RESERVE", [this.keyBloom, 0.01, 1000]);
    await redisInstance.send_command("CF.RESERVE", [this.keyCuckoo, 1000]);
  }

  async bloomFilter(value) {
    const username = value ? value : generateRandomUsername();
    const exists = await redisInstance.send_command("BF.EXISTS", [
      this.keyBloom,
      username,
    ]);
    if (exists === 1) {
      return { message: "Người dùng đã tồn tại." };
    } else {
      await redisInstance.send_command("BF.ADD", [this.keyBloom, username]);
      return { message: "Người dùng mới đã được thêm vào." };
    }
  }

  async cuckooFilter(username) {
    const exists = await redisInstance.send_command("CF.EXISTS", [
      this.cuckooKey,
      username,
    ]);
    if (exists === 1) {
      return { message: "Người dùng đã tồn tại." };
    } else {
      await redisInstance.send_command("CF.ADD", [this.cuckooKey, username]);
      return { message: "Người dùng mới đã được thêm vào." };
    }
  }

  async cuckooDeleteUser(username) {
    const removed = await redisInstance.send_command("CF.DEL", [
      this.cuckooKey,
      username,
    ]);
    if (removed === 1) {
      return { message: "Người dùng đã được xóa." };
    } else {
      return { message: "Người dùng không tồn tại." };
    }
  }
}

module.exports = new RedisV3Service();
