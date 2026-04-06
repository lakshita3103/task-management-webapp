import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BoardSidebar from "../components/BoardSidebar";
import EmptyState from "../components/EmptyState";
import Layout from "../components/Layout";
import ListColumn from "../components/ListColumn";
import LoadingState from "../components/LoadingState";
import { boardsApi, listsApi, tasksApi } from "../services/api";

function BoardsPage() {
  const navigate = useNavigate();
  const { boardId } = useParams();

  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [search, setSearch] = useState("");
  const [boardForm, setBoardForm] = useState({ title: "", description: "" });
  const [listTitle, setListTitle] = useState("");
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [creatingBoard, setCreatingBoard] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const boardCountLabel = useMemo(() => `${boards.length} board${boards.length === 1 ? "" : "s"}`, [boards]);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        setLoadingBoards(true);
        const data = await boardsApi.getBoards();
        setBoards(data.boards);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoadingBoards(false);
      }
    };

    loadBoards();
  }, []);

  useEffect(() => {
    if (loadingBoards) {
      return;
    }

    if (!boardId && boards.length) {
      navigate(`/boards/${boards[0]._id}`, { replace: true });
      return;
    }

    if (!boardId) {
      setSelectedBoard(null);
      return;
    }

    const loadBoard = async () => {
      try {
        setLoadingBoard(true);
        const data = await boardsApi.getBoard(boardId);
        setSelectedBoard(data.board);
      } catch (requestError) {
        setError(requestError.message);
        setSelectedBoard(null);
      } finally {
        setLoadingBoard(false);
      }
    };

    loadBoard();
  }, [boardId, boards, loadingBoards, navigate]);

  const handleBoardFormChange = (event) => {
    const { name, value } = event.target;
    setBoardForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateBoard = async (event) => {
    event.preventDefault();
    try {
      setCreatingBoard(true);
      setError("");
      const data = await boardsApi.createBoard(boardForm);
      setBoards((current) => [data.board, ...current]);
      setBoardForm({ title: "", description: "" });
      setSuccess(data.message);
      navigate(`/boards/${data.board._id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCreatingBoard(false);
    }
  };

  const handleDeleteBoard = async (targetBoardId) => {
    if (!window.confirm("Delete this board and everything inside it?")) {
      return;
    }

    try {
      setError("");
      const data = await boardsApi.deleteBoard(targetBoardId);
      const updatedBoards = boards.filter((board) => board._id !== targetBoardId);
      setBoards(updatedBoards);
      setSuccess(data.message);

      if (boardId === targetBoardId) {
        if (updatedBoards.length) {
          navigate(`/boards/${updatedBoards[0]._id}`);
        } else {
          navigate("/boards");
        }
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleCreateList = async (event) => {
    event.preventDefault();

    if (!selectedBoard) {
      return;
    }

    try {
      setCreatingList(true);
      setError("");
      const data = await listsApi.createList(selectedBoard._id, { title: listTitle });
      setSelectedBoard((current) => ({
        ...current,
        lists: [...current.lists, data.list]
      }));
      setListTitle("");
      setSuccess(data.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCreatingList(false);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!selectedBoard || !window.confirm("Delete this list and all its cards?")) {
      return;
    }

    try {
      setError("");
      const data = await listsApi.deleteList(selectedBoard._id, listId);
      setSelectedBoard((current) => ({
        ...current,
        lists: current.lists.filter((list) => list._id !== listId)
      }));
      setSuccess(data.message);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleCreateTask = async (listId, payload) => {
    try {
      setError("");
      const data = await tasksApi.createTask(listId, payload);
      setSelectedBoard((current) => ({
        ...current,
        lists: current.lists.map((list) =>
          list._id === listId ? { ...list, tasks: [...list.tasks, data.task] } : list
        )
      }));
      setSuccess(data.message);
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const handleToggleTask = async (listId, taskId) => {
    try {
      setError("");
      const data = await tasksApi.toggleTask(listId, taskId);
      setSelectedBoard((current) => ({
        ...current,
        lists: current.lists.map((list) =>
          list._id === listId
            ? {
                ...list,
                tasks: list.tasks.map((task) => (task._id === taskId ? data.task : task))
              }
            : list
        )
      }));
      setSuccess(data.message);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeleteTask = async (listId, taskId) => {
    try {
      setError("");
      const data = await tasksApi.deleteTask(listId, taskId);
      setSelectedBoard((current) => ({
        ...current,
        lists: current.lists.map((list) =>
          list._id === listId
            ? {
                ...list,
                tasks: list.tasks.filter((task) => task._id !== taskId)
              }
            : list
        )
      }));
      setSuccess(data.message);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <Layout>
      <div className="workspace-grid">
        <BoardSidebar
          boards={boards}
          boardId={boardId}
          search={search}
          onSearchChange={setSearch}
          boardForm={boardForm}
          onBoardFormChange={handleBoardFormChange}
          onCreateBoard={handleCreateBoard}
          creatingBoard={creatingBoard}
          onDeleteBoard={handleDeleteBoard}
        />

        <section className="workspace-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Kanban workspace</p>
              <h2>{selectedBoard ? selectedBoard.title : "Board details"}</h2>
              <p>{selectedBoard ? selectedBoard.description || "Create lists and cards to track work visually." : `Choose a board from the ${boardCountLabel} in your workspace.`}</p>
            </div>
          </div>

          {success && <div className="alert success">{success}</div>}
          {error && <div className="alert error">{error}</div>}

          {loadingBoards ? (
            <LoadingState label="Loading boards..." />
          ) : !boards.length ? (
            <EmptyState
              title="No boards yet"
              message="Create your first board from the panel on the left to start organizing work."
            />
          ) : loadingBoard ? (
            <LoadingState label="Loading board details..." />
          ) : !selectedBoard ? (
            <EmptyState
              title="Open a board to see the kanban layout"
              message="Once you select a board, its lists and tasks will appear here in Trello-style columns."
            />
          ) : (
            <>
              <form className="stack-card list-form" onSubmit={handleCreateList}>
                <div>
                  <h3>Add a new column</h3>
                  <p>Create lists such as To Do, In Progress, and Done.</p>
                </div>
                <div className="inline-form">
                  <input
                    className="text-input"
                    type="text"
                    maxLength="60"
                    required
                    value={listTitle}
                    onChange={(event) => setListTitle(event.target.value)}
                    placeholder="Enter list title"
                  />
                  <button className="primary-button" disabled={creatingList} type="submit">
                    {creatingList ? "Adding..." : "Add list"}
                  </button>
                </div>
              </form>

              {!selectedBoard.lists.length ? (
                <EmptyState
                  title="No columns yet"
                  message="Create your first list above. Typical examples are To Do, In Progress, and Done."
                />
              ) : (
                <div className="board-columns">
                  {selectedBoard.lists.map((list) => (
                    <ListColumn
                      key={list._id}
                      list={list}
                      onDeleteList={handleDeleteList}
                      onCreateTask={handleCreateTask}
                      onToggleTask={handleToggleTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default BoardsPage;
