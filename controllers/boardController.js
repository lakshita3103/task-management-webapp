const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");
const { setFlash } = require("../middleware/flashMiddleware");

function cleanText(value, maxLength) {
  return (value || "").trim().slice(0, maxLength);
}

async function buildBoardPage(selectedBoardId) {
  const boards = await Board.find().sort({ createdAt: -1 }).lean();
  const activeBoardId = selectedBoardId || boards[0]?._id?.toString() || null;

  if (!activeBoardId) {
    return {
      boards,
      selectedBoard: null,
      listsWithTasks: []
    };
  }

  const selectedBoard = await Board.findById(activeBoardId).lean();

  if (!selectedBoard) {
    return {
      boards,
      selectedBoard: null,
      listsWithTasks: []
    };
  }

  const lists = await List.find({ board: activeBoardId })
    .sort({ createdAt: 1 })
    .lean();
  const listIds = lists.map((list) => list._id);
  const tasks = await Task.find({ list: { $in: listIds } })
    .sort({ createdAt: 1 })
    .lean();

  const listsWithTasks = lists.map((list) => ({
    ...list,
    tasks: tasks.filter((task) => task.list.toString() === list._id.toString())
  }));

  return {
    boards,
    selectedBoard,
    listsWithTasks
  };
}

async function index(req, res) {
  const viewModel = await buildBoardPage(req.query.boardId);

  res.render("boards/index", {
    title: "TaskFlow Boards",
    ...viewModel
  });
}

async function show(req, res) {
  const viewModel = await buildBoardPage(req.params.boardId);

  if (!viewModel.selectedBoard) {
    const error = new Error("Board not found.");
    error.statusCode = 404;
    throw error;
  }

  res.render("boards/index", {
    title: `${viewModel.selectedBoard.title} | TaskFlow`,
    ...viewModel
  });
}

async function create(req, res) {
  const title = cleanText(req.body.title, 60);
  const description = cleanText(req.body.description, 180);

  if (!title) {
    setFlash(req, "error", "Board title is required.");
    return res.redirect("/boards");
  }

  const board = await Board.create({ title, description });
  setFlash(req, "success", "Board created successfully.");
  res.redirect(`/boards/${board._id}`);
}

async function destroy(req, res) {
  const board = await Board.findById(req.params.boardId);

  if (!board) {
    setFlash(req, "error", "Board not found.");
    return res.redirect("/boards");
  }

  const lists = await List.find({ board: board._id }).select("_id");
  const listIds = lists.map((list) => list._id);

  await Task.deleteMany({ list: { $in: listIds } });
  await List.deleteMany({ board: board._id });
  await Board.findByIdAndDelete(board._id);

  setFlash(req, "success", "Board deleted.");
  res.redirect("/boards");
}

module.exports = {
  index,
  show,
  create,
  destroy
};
