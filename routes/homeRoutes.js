const router = require("express").Router();

const { redirectToBoards } = require("../controllers/homeController");

router.get("/", redirectToBoards);

module.exports = router;
