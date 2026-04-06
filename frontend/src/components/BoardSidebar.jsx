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

  return (
    <aside className="sidebar-card">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h2>My Boards</h2>
        </div>
        <span className="pill">{boards.length} boards</span>
      </div>

      <div className="search-block">
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search boards by name"
          className="text-input"
        />
      </div>

      <form className="stack-card" onSubmit={onCreateBoard}>
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
