//* LIB
const cron = require("node-cron");

//* IMPORT
const userOtpModel = require("../app/v2/models/user_otp.model");

cron.schedule("*/60 * * * *", function () {
  userOtpModel.deleteExpiredRecords();
});
