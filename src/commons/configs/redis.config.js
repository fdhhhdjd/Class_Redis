//* LIB
require("dotenv").config();

//* IMPORT
const { NODE_ENV } = require("../constants");

const dev = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },
};
const pro = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },
};
const config = { dev, pro };

const env = process.env.NODE_ENV || NODE_ENV.DEV;

module.exports = config[env];
