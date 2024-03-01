//* IMPORT
const { SendEmail, UserExit } = require("../../commons/keys/sub");
const redisPubSub = require("../../databases/init.sub");

redisPubSub.registerHandler(SendEmail, (message) => {
  console.log("Received Message:", JSON.parse(message));
});

redisPubSub.registerHandler(UserExit, (message) => {
  console.log("Received Message:", JSON.parse(message));
});

redisPubSub.initializeSubscriptions([SendEmail, UserExit]);
