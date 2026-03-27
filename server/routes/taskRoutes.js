const router = require("express").Router();
const Task = require("../models/Task");

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body); // 👈 DEBUG

    const { title, listId } = req.body;

    if (!title || !listId) {
      return res.status(400).json({ message: "Missing title or listId" });
    }

    const task = await Task.create({
      title,
      listId,
    });

    res.json(task);
  } catch (err) {
    console.log("ERROR:", err); // 👈 VERY IMPORTANT
    res.status(500).json({ error: "Server error" });
  }
});

// GET TASKS
router.get("/:listId", async (req, res) => {
  try {
    const tasks = await Task.find({
      listId: req.params.listId,
    });

    res.json(tasks);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

module.exports = router;