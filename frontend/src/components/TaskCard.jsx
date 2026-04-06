function TaskCard({ task, onToggle, onDelete }) {
  return (
    <article className="task-card">
      <div className="task-card__header">
        <div>
          <span className={`status-pill ${task.completed ? "done" : "pending"}`}>
            {task.completed ? "Done" : "In Progress"}
          </span>
          <h4>{task.title}</h4>
        </div>
      </div>

      <p>{task.description || "No description provided for this card."}</p>

      <div className="task-card__actions">
        <button type="button" className="secondary-button" onClick={onToggle}>
          {task.completed ? "Move back" : "Move forward"}
        </button>
        <button type="button" className="danger-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
