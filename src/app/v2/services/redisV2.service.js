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

  async geoSpatial() {
    const keyStore = "stores";

    const storeLocations = [
      { name: "Store Tai", longitude: -122.419416, latitude: 37.774929 },
      { name: "Store Tuyen", longitude: 2.352222, latitude: 48.856613 },
      { name: "Store Hao", longitude: -74.006, latitude: 40.7128 },
    ];

    storeLocations.forEach((store) => {
      redisInstance.geoadd(keyStore, store.latitude, store.name, "CH");
    });

    const userLongitude = -124.419416;
    const userLatitude = 34.774929;
    const searchRadius = 160000; // 10,000 km
    function formatDistance(distance) {
      if (distance >= 1000) {
        return (distance / 1000).toFixed(2) + "km";
      } else if (distance >= 1) {
        return distance.toFixed(0) + "m";
      } else {
        return distance.toFixed(3) + "m";
      }
    }

    const result = await new Promise((resolve, reject) => {
      redisInstance.georadius(
        keyStore,
        userLongitude,
        userLatitude,
        searchRadius,
        "km",
        "WITHDIST",
        "WITHCOORD",
        "WITHHASH",
        "DESC",
        "COUNT",
        10,
        (err, result) => {
          if (err) {
            console.error("Error finding nearby store:", err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const convertedData =
      result?.map((nearestStore) => ({
        nearest_store: nearestStore[0],
        distance: formatDistance(parseFloat(nearestStore[1])),
        coordinates: {
          longitude: parseFloat(nearestStore[3][0]),
          latitude: parseFloat(nearestStore[3][1]),
        },
      })) || [];

    return convertedData;
  }
}

module.exports = new RedisV2Service();
