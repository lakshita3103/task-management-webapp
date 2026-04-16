import { Link } from "react-router-dom";

function BoardSidebar({
  boards,
  boardId,
  search,
  onSearchChange,
  boardForm,
  onBoardFormChange,
  onCreateBoard,
  creatingBoard,
  onDeleteBoard
}) {
  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(search.toLowerCase())
  );
  const activeBoard = boards.find((board) => board._id === boardId);

  return (
    <aside className="sidebar-card sidebar-panel">
      <div className="panel-heading sidebar-card__header">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h2>My Boards</h2>
        </div>
        <span className="pill">{boards.length} boards</span>
      </div>

      <div className="sidebar-summary sidebar-summary--compact">
        <div className="metric-card">
          <span>Current board</span>
          <strong>{activeBoard?.title || "Choose a board"}</strong>
        </div>
        <div className="metric-card">
          <span>Total cards</span>
          <strong>{boards.reduce((total, board) => total + (board.lists?.reduce((count, list) => count + (list.tasks?.length || 0), 0) || 0), 0)} cards</strong>
        </div>
      </div>

      <div className="sidebar-card__section">
        <div className="search-block">
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search boards by name"
            className="text-input"
          />
        </div>
      </div>

      <form className="stack-card sidebar-card__section" onSubmit={onCreateBoard}>
        <div className="stack-card__header">
          <div>
            <h3>Create a new board</h3>
            <p>Add a board name and an optional short description.</p>
          </div>
        </div>
        <input
          className="text-input"
          name="title"
          maxLength="60"
          required
          value={boardForm.title}
          onChange={onBoardFormChange}
          placeholder="Board name"
        />
        <input
          className="text-input"
          name="description"
          maxLength="180"
          value={boardForm.description}
          onChange={onBoardFormChange}
          placeholder="Optional description"
        />
        <button className="primary-button" disabled={creatingBoard} type="submit">
          {creatingBoard ? "Creating..." : "Save board"}
        </button>
      </form>

      <div className="boards-list">
        {filteredBoards.map((board) => {
          const active = boardId === board._id;

          return (
            <article className={`board-link-card ${active ? "is-active" : ""}`} key={board._id}>
              <Link to={`/boards/${board._id}`} className="board-link-card__content">
                <div className="board-link-card__top">
                  <span className="mini-pill">Board</span>
                  {active && <span className="mini-pill is-active">Open</span>}
                </div>
                <h3>{board.title}</h3>
                <p>{board.description || "Open the board to start organizing lists and cards."}</p>
              </Link>
              <button
                type="button"
                className="danger-button danger-button--ghost"
                onClick={() => onDeleteBoard(board._id)}
              >
                Delete
              </button>
            </article>
          );
        })}
      </div>
    </aside>
  );
}

export default BoardSidebar;
