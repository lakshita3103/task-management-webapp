const router = require("express").Router({ mergeParams: true });

const asyncHandler = require("../../middleware/asyncHandler");
const listApiController = require("../../controllers/api/listApiController");

router.post("/", asyncHandler(listApiController.create));
router.delete("/:listId", asyncHandler(listApiController.destroy));

module.exports = router;
