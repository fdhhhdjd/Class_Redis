//* LIB
require("dotenv").config();

//* IMPORT
const { NODE_ENV } = require("../constants");

const dev = {
  cloud: {
    name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  },
};
const pro = {
  cloud: {
    name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  },
};
const config = { dev, pro };

const env = process.env.NODE_ENV || NODE_ENV.DEV;

module.exports = config[env];
