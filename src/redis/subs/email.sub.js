//* IMPORT
const {
  SendEmail,
  UserExit,
  AdminMaster,
  AdminTopic,
  InTheSameAfter,
} = require("../../commons/keys/sub");
const redisPubSub = require("../../databases/init.sub");

redisPubSub.initializeSubscriptions([
  SendEmail,
  UserExit,
  AdminMaster,
  AdminTopic,
  InTheSameAfter,
]);

redisPubSub.registerHandler(SendEmail, (message) => {
  console.log(`Received Message: ${SendEmail}`, JSON.parse(message));
});

redisPubSub.registerHandler(UserExit, (message) => {
  console.log(`Received Message: ${UserExit}`, JSON.parse(message));
});

redisPubSub.registerHandler(AdminMaster, (message) => {
  console.log(`Received Message ${AdminMaster}:`, JSON.parse(message));
});

redisPubSub.registerHandler(AdminTopic, (message) => {
  console.log(`Received Message ${AdminTopic}:`, JSON.parse(message));
});
redisPubSub.registerHandler(InTheSameAfter, (message) => {
  console.log(`Received Message ${InTheSameAfter}:`, JSON.parse(message));
});
