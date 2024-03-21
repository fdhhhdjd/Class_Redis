//* LIB
const express = require("express");

//* IMPORT
const redisController = require("../../controllers/redisV2.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

router.post("/hyperLogLog", asyncHandler(redisController.hyperLogLog));
router.get("/info/HyperLogLog", asyncHandler(redisController.infoHyperLogLog));

module.exports = router;
