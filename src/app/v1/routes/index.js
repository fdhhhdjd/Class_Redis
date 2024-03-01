"use strict";

//* LIB
const express = require("express");

const router = express.Router();

router.use("/redis", require("./redis"));

module.exports = router;
