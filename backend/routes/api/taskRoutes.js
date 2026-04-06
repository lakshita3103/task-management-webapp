const router = require("express").Router({ mergeParams: true });

const asyncHandler = require("../../middleware/asyncHandler");
const taskApiController = require("../../controllers/api/taskApiController");

router.post("/", asyncHandler(taskApiController.create));
router.patch("/:taskId", asyncHandler(taskApiController.update));
router.delete("/:taskId", asyncHandler(taskApiController.destroy));

module.exports = router;
