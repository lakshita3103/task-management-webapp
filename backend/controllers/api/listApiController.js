const Board = require("../../models/Board");
const List = require("../../models/List");
const Task = require("../../models/Task");

function cleanText(value, maxLength) {
  return (value || "").trim().slice(0, maxLength);
}

async function create(req, res) {
  const title = cleanText(req.body.title, 60);
  const boardId = req.params.boardId;

  const board = await Board.findOne({ _id: boardId, user: req.user._id });
  if (!board) {
    return res.status(404).json({ message: "Board not found." });
  }

  if (!title) {
    return res.status(400).json({ message: "List title is required." });
  }

  const list = await List.create({ title, board: boardId, user: req.user._id });

  res.status(201).json({
    message: "List added.",
    list: {
      ...list.toObject(),
      tasks: []
    }
  });
}

async function destroy(req, res) {
  const { boardId, listId } = req.params;

  const list = await List.findOne({ _id: listId, board: boardId, user: req.user._id });
  if (!list) {
    return res.status(404).json({ message: "List not found." });
  }

  await Task.deleteMany({ list: listId, user: req.user._id });
  await List.findByIdAndDelete(listId);

  res.json({
    message: "List deleted.",
    deletedListId: listId
  });
}

module.exports = {
  create,
  destroy
};
