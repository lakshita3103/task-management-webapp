const router = require("express").Router();

const boardController = require("../controllers/boardController");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/", asyncHandler(boardController.index));
router.post("/", asyncHandler(boardController.create));
router.get("/:boardId", asyncHandler(boardController.show));
router.delete("/:boardId", asyncHandler(boardController.destroy));

module.exports = router;
