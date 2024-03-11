//* LIB
const path = require("path");

//* IMPORT
const { User } = require("../../commons/keys/sub");
const redisPubSub = require("../../databases/init.sub");
const sendEmail = require("../../commons/utils/sendEmail");

redisPubSub.initializeSubscriptions([]);

redisPubSub.registerHandler(User.SpamPassword, (message) => {
  if (message) {
    sendEmail({
      to: message.email,
      subject: `Spam Password`,
      template: "spamPassword",
      attachments: [],
      context: {
        email: message.email,
        timeBlock: message.timeBlock,
      },
    });
  }
});

// redisPubSub.registerHandler(UserExit, (message) => {
//   console.log(`Received Message: ${UserExit}`, JSON.parse(message));
// });

// redisPubSub.registerHandler(AdminMaster, (message) => {
//   console.log(`Received Message ${AdminMaster}:`, JSON.parse(message));
// });

// redisPubSub.registerHandler(AdminTopic, (message) => {
//   console.log(`Received Message ${AdminTopic}:`, JSON.parse(message));
// });
// redisPubSub.registerHandler(InTheSameAfter, (message) => {
//   console.log(`Received Message ${InTheSameAfter}:`, JSON.parse(message));
// });
