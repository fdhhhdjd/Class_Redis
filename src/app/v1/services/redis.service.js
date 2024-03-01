//* IMPORT
const redisPub = require("../../../databases/init.pub");
class LabelService {
  // Todo 1. Get all
  async pub() {
    const data = {
      id: "id",
      name: "name",
    };
    redisPub.publish("user:exit", JSON.stringify(data));
    return data;
  }
}

module.exports = new LabelService();
