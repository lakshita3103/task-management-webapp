const router = require("express").Router({ mergeParams: true });

const listController = require("../controllers/listController");
const asyncHandler = require("../middleware/asyncHandler");

router.post("/", asyncHandler(listController.create));
router.delete("/:listId", asyncHandler(listController.destroy));

module.exports = router;
