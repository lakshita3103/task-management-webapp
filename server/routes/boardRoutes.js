const router = require("express").Router();
const Board = require("../models/Board");

// Create Board
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    const board = await Board.create({ title });

    res.json(board);
  } catch (err) {
    console.log(err); // 🔥 VERY IMPORTANT
    res.status(500).json({ error: "Server error" });
  }
});

// Get Boards
router.get("/", async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;