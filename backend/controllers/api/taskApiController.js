const List = require("../../models/List");
const Task = require("../../models/Task");

function cleanText(value, maxLength) {
  return (value || "").trim().slice(0, maxLength);
}

async function create(req, res) {
  const listId = req.params.listId;
  const title = cleanText(req.body.title, 80);
  const description = cleanText(req.body.description, 240);

  const list = await List.findOne({ _id: listId, user: req.user._id });
  if (!list) {
    return res.status(404).json({ message: "List not found." });
  }

  if (!title) {
    return res.status(400).json({ message: "Task title is required." });
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    list: listId
  });

  res.status(201).json({
    message: "Task created.",
    task
  });
}

async function update(req, res) {
  const { listId, taskId } = req.params;

  const task = await Task.findOne({ _id: taskId, list: listId, user: req.user._id });
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  task.completed = !task.completed;
  await task.save();

  res.json({
    message: task.completed ? "Task marked as complete." : "Task moved back to pending.",
    task
  });
}

async function destroy(req, res) {
  const { listId, taskId } = req.params;

  const task = await Task.findOne({ _id: taskId, list: listId, user: req.user._id });
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  await Task.findByIdAndDelete(taskId);

  res.json({
    message: "Task deleted.",
    deletedTaskId: taskId
  });
}

module.exports = {
  create,
  update,
  destroy
};
