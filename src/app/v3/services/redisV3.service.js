//* IMPORT
const { generateRandomUsername } = require("../../../commons/utils/random");
const redisInstance = require("../../../databases/init.redis");

class RedisV3Service {
  constructor() {
    this.keyBloom = "keyBloom";
    this.keyCuckoo = "keyCuckoo";
    this.topkKey = "topk-key";
    this.cmsKey = "cms-key";
  }

  async init() {
    // Kiểm tra sự tồn tại trước khi khởi tạo Bloom Filter
    const bloomExists = await redisInstance.send_command("EXISTS", [
      this.keyBloom,
    ]);
    if (!bloomExists) {
      await redisInstance.send_command("BF.RESERVE", [
        this.keyBloom,
        0.01,
        1000,
      ]);
    }

    // Kiểm tra sự tồn tại trước khi khởi tạo Cuckoo Filter
    const cuckooExists = await redisInstance.send_command("EXISTS", [
      this.keyCuckoo,
    ]);
    if (!cuckooExists) {
      await redisInstance.send_command("CF.RESERVE", [this.keyCuckoo, 1000]);
    }

    // Kiểm tra sự tồn tại trước khi khởi tạo Count-Min Sketch
    const cmsExists = await redisInstance.send_command("EXISTS", [this.cmsKey]);
    if (!cmsExists) {
      await redisInstance.send_command("CMS.INITBYDIM", [this.cmsKey, 1000, 5]);
    }

    // Kiểm tra sự tồn tại trước khi khởi tạo Top-K
    const topkExists = await redisInstance.send_command("EXISTS", [
      this.topkKey,
    ]);
    if (!topkExists) {
      await redisInstance.send_command("TOPK.RESERVE", [
        this.topkKey,
        "10000",
        "50",
        "2000",
        "0.5",
      ]);
    }
  }

  // Todo: Bloom
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

  // Todo: Cuckoo
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

  // Todo:Top-K
  async addValue(value, count = 1) {
    const exists = await redisInstance.exists(this.topkKey);
    if (!exists) {
      return { message: "Key not found" };
    }
    await redisInstance.send_command("TOPK.ADD", [this.topkKey, value, count]);
    return { message: "Add Top K Success" };
  }

  async getCount(value) {
    const count = await redisInstance.send_command("TOPK.COUNT", [
      this.topkKey,
      value,
    ]);
    return count;
  }

  async getTopK() {
    const result = await redisInstance.send_command("TOPK.LIST", [
      this.topkKey,
    ]);
    return result;
  }

  //* Count-Min Sketch
  async addValueText(value, count = 1) {
    await redisInstance.send_command("CMS.INCRBY", [this.cmsKey, value, count]);
    return { message: "Add Count-Min Sketch Success" };
  }

  async getCountText(value) {
    // Lấy ước lượng số lần xuất hiện của giá trị từ Count-Min Sketch
    const count = await redisInstance.send_command("CMS.QUERY", [
      this.cmsKey,
      value,
    ]);
    return count;
  }
}

module.exports = new RedisV3Service();
