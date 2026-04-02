const List = require("../models/List");
const Task = require("../models/Task");
const { setFlash } = require("../middleware/flashMiddleware");

function cleanText(value, maxLength) {
  return (value || "").trim().slice(0, maxLength);
}

async function create(req, res) {
  const listId = req.params.listId;
  const title = cleanText(req.body.title, 80);
  const description = cleanText(req.body.description, 240);
  const boardId = req.body.boardId;

  const list = await List.findById(listId);
  if (!list) {
    setFlash(req, "error", "List not found.");
    return res.redirect("/boards");
  }

  if (!title) {
    setFlash(req, "error", "Task title is required.");
    return res.redirect(`/boards/${boardId || list.board}`);
  }

  await Task.create({
    title,
    description,
    list: listId
  });

  setFlash(req, "success", "Task created.");
  res.redirect(`/boards/${boardId || list.board}`);
}

async function update(req, res) {
  const listId = req.params.listId;
  const taskId = req.params.taskId;
  const boardId = req.body.boardId;

  const task = await Task.findOne({ _id: taskId, list: listId });
  if (!task) {
    setFlash(req, "error", "Task not found.");
    return res.redirect(`/boards/${boardId}`);
  }

  task.completed = !task.completed;
  await task.save();

  setFlash(
    req,
    "success",
    task.completed ? "Task marked as complete." : "Task moved back to pending."
  );
  res.redirect(`/boards/${boardId}`);
}

async function destroy(req, res) {
  const listId = req.params.listId;
  const taskId = req.params.taskId;
  const boardId = req.body.boardId;

  const task = await Task.findOne({ _id: taskId, list: listId });
  if (!task) {
    setFlash(req, "error", "Task not found.");
    return res.redirect(`/boards/${boardId}`);
  }

  await Task.findByIdAndDelete(taskId);
  setFlash(req, "success", "Task deleted.");
  res.redirect(`/boards/${boardId}`);
}

module.exports = {
  create,
  update,
  destroy
};
