//* IMPORT
const { SEND_EMAIL, USER_EXIT } = require("../../commons/keys/sub");
const redisPubSub = require("../../databases/init.sub");

redisPubSub.registerHandler(SEND_EMAIL, (message) => {
  console.log("Received Message:", JSON.parse(message));
});

redisPubSub.registerHandler(USER_EXIT, (message) => {
  console.log("Received Message:", JSON.parse(message));
});

redisPubSub.initializeSubscriptions([SEND_EMAIL, USER_EXIT]);
