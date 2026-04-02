const router = require("express").Router({ mergeParams: true });

const taskController = require("../controllers/taskController");
const asyncHandler = require("../middleware/asyncHandler");

router.post("/", asyncHandler(taskController.create));
router.patch("/:taskId", asyncHandler(taskController.update));
router.delete("/:taskId", asyncHandler(taskController.destroy));

module.exports = router;
