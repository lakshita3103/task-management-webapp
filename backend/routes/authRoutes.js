const router = require("express").Router();

const authController = require("../controllers/authController");
const asyncHandler = require("../middleware/asyncHandler");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/logout", authController.logout);
router.get("/me", protect, asyncHandler(authController.getCurrentUser));

module.exports = router;
