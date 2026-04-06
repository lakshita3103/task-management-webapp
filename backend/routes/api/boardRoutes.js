const router = require("express").Router();

const asyncHandler = require("../../middleware/asyncHandler");
const boardApiController = require("../../controllers/api/boardApiController");

router.get("/", asyncHandler(boardApiController.index));
router.post("/", asyncHandler(boardApiController.create));
router.get("/:boardId", asyncHandler(boardApiController.show));
router.delete("/:boardId", asyncHandler(boardApiController.destroy));

module.exports = router;
