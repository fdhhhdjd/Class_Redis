//* LIB
const express = require("express");

//* IMPORT
const redisController = require("../../controllers/redisV2.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

router.get("/bloom-filter", asyncHandler(redisController.bloomFilter));

router.get("/cuckoo-filter", asyncHandler(redisController.cuckooFilter));

router.get("/cuckoo-delete", asyncHandler(redisController.cuckooDeleteUser));

module.exports = router;
