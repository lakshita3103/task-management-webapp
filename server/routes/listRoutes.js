const router = require("express").Router();
const List = require("../models/List");

// CREATE LIST
router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body); // 👈 DEBUG

    const { title, boardId } = req.body;

    if (!title || !boardId) {
      return res.status(400).json({ message: "Title or BoardId missing" });
    }

    const list = await List.create({
      title,
      boardId,
    });

    res.json(list);
  } catch (err) {
    console.log("ERROR:", err); // 👈 VERY IMPORTANT
    res.status(500).json({ error: "Server error" });
  }
});

// GET LISTS
router.get("/:boardId", async (req, res) => {
  try {
    const lists = await List.find({
      boardId: req.params.boardId,
    });

    res.json(lists);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;