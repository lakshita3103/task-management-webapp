const Board = require("../../models/Board");
const List = require("../../models/List");
const Task = require("../../models/Task");

function cleanText(value, maxLength) {
  return (value || "").trim().slice(0, maxLength);
}

async function getBoardPayload(boardId) {
  const board = await Board.findById(boardId).lean();

  if (!board) {
    return null;
  }

  const lists = await List.find({ board: boardId }).sort({ createdAt: 1 }).lean();
  const listIds = lists.map((list) => list._id);
  const tasks = await Task.find({ list: { $in: listIds } }).sort({ createdAt: 1 }).lean();

  return {
    ...board,
    lists: lists.map((list) => ({
      ...list,
      tasks: tasks.filter((task) => task.list.toString() === list._id.toString())
    }))
  };
}

async function getUserBoardPayload(boardId, userId) {
  const board = await Board.findOne({ _id: boardId, user: userId }).lean();

  if (!board) {
    return null;
  }

  const lists = await List.find({ board: boardId, user: userId }).sort({ createdAt: 1 }).lean();
  const listIds = lists.map((list) => list._id);
  const tasks = await Task.find({ list: { $in: listIds }, user: userId }).sort({ createdAt: 1 }).lean();

  return {
    ...board,
    lists: lists.map((list) => ({
      ...list,
      tasks: tasks.filter((task) => task.list.toString() === list._id.toString())
    }))
  };
}

async function index(req, res) {
  const boards = await Board.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ boards });
}

async function show(req, res) {
  const board = await getUserBoardPayload(req.params.boardId, req.user._id);

  if (!board) {
    return res.status(404).json({ message: "Board not found." });
  }

  res.json({ board });
}

async function create(req, res) {
  const title = cleanText(req.body.title, 60);
  const description = cleanText(req.body.description, 180);

  if (!title) {
    return res.status(400).json({ message: "Board title is required." });
  }

  const board = await Board.create({ title, description, user: req.user._id });
  const payload = await getUserBoardPayload(board._id, req.user._id);

  res.status(201).json({
    message: "Board created successfully.",
    board: payload
  });
}

async function destroy(req, res) {
  const board = await Board.findOne({ _id: req.params.boardId, user: req.user._id });

  if (!board) {
    return res.status(404).json({ message: "Board not found." });
  }

  const lists = await List.find({ board: board._id, user: req.user._id }).select("_id");
  const listIds = lists.map((list) => list._id);

  await Task.deleteMany({ list: { $in: listIds }, user: req.user._id });
  await List.deleteMany({ board: board._id, user: req.user._id });
  await Board.findByIdAndDelete(board._id);

  res.json({
    message: "Board deleted.",
    deletedBoardId: req.params.boardId
  });
}

module.exports = {
  index,
  show,
  create,
  destroy
};
