const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");
const { setFlash } = require("../middleware/flashMiddleware");

function cleanText(value, maxLength) {
  return (value || "").trim().slice(0, maxLength);
}

async function create(req, res) {
  const title = cleanText(req.body.title, 60);
  const boardId = req.params.boardId;

  const board = await Board.findById(boardId);
  if (!board) {
    setFlash(req, "error", "Board not found.");
    return res.redirect("/boards");
  }

  if (!title) {
    setFlash(req, "error", "List title is required.");
    return res.redirect(`/boards/${boardId}`);
  }

  await List.create({
    title,
    board: boardId
  });

  setFlash(req, "success", "List added.");
  res.redirect(`/boards/${boardId}`);
}

async function destroy(req, res) {
  const { boardId, listId } = req.params;

  const list = await List.findOne({ _id: listId, board: boardId });
  if (!list) {
    setFlash(req, "error", "List not found.");
    return res.redirect(`/boards/${boardId}`);
  }

  await Task.deleteMany({ list: listId });
  await List.findByIdAndDelete(listId);

  setFlash(req, "success", "List deleted.");
  res.redirect(`/boards/${boardId}`);
}

module.exports = {
  create,
  destroy
};
