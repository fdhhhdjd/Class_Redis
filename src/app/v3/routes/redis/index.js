//* LIB
const express = require("express");

//* IMPORT
const redisController = require("../../controllers/redisV3.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");

const router = express.Router();

//* Bloom
router.get("/bloom-filter", asyncHandler(redisController.bloomFilter));

//* Cuckoo
router.get("/cuckoo-filter", asyncHandler(redisController.cuckooFilter));

router.get("/cuckoo-delete", asyncHandler(redisController.cuckooDeleteUser));

//* TOP-K
router.get("/top-k/add", asyncHandler(redisController.addValue));

router.get("/top-k/count", asyncHandler(redisController.getCount));

router.get("/top-k", asyncHandler(redisController.getTopK));

//* Count-Min Sketch
router.post("/count-min-sketch", asyncHandler(redisController.addValueText));

router.get("/count-min-sketch", asyncHandler(redisController.getCountText));

module.exports = router;
