//* LIB
const express = require("express");

//* IMPORT
const redisController = require("../../controllers/redisV2.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

router.get("/hyperLogLog", asyncHandler(redisController.hyperLogLog));
router.get("/info/hyperLogLog", asyncHandler(redisController.infoHyperLogLog));
router.get("/geoSpatial", asyncHandler(redisController.geoSpatial));
router.get("/lock", asyncHandler(redisController.lockRequestCache));

module.exports = router;
