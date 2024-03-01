//* LIB
const express = require("express");

//* IMPORT
const redisController = require("../../controllers/redis.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

router.get("/pub", asyncHandler(redisController.pub));
router.get("/get", asyncHandler(redisController.getData));
router.post("/save", asyncHandler(redisController.saveData));

module.exports = router;
