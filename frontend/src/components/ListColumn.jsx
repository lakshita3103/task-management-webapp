import { useState } from "react";

import TaskCard from "./TaskCard";

function ListColumn({ list, onDeleteList, onCreateTask, onToggleTask, onDeleteTask }) {
  const [taskForm, setTaskForm] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onCreateTask(list._id, taskForm);
      setTaskForm({ title: "", description: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="list-column">
      <div className="list-column__header">
        <div>
          <h3>{list.title}</h3>
          <p>{list.tasks.length} cards</p>
        </div>
        <button type="button" className="danger-button danger-button--ghost" onClick={() => onDeleteList(list._id)}>
          Remove
        </button>
      </div>

      <div className="tasks-stack">
        {list.tasks.length === 0 && <div className="task-placeholder">No cards in this list yet.</div>}

        {list.tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={() => onToggleTask(list._id, task._id)}
            onDelete={() => onDeleteTask(list._id, task._id)}
          />
        ))}
      </div>

      <form className="stack-card task-form" onSubmit={handleSubmit}>
        <label className="form-label">Add new card</label>
        <input
          className="text-input"
          type="text"
          maxLength="80"
          required
          placeholder="Card title"
          value={taskForm.title}
          onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))}
        />
        <textarea
          className="text-area"
          rows="3"
          maxLength="240"
          placeholder="Description"
          value={taskForm.description}
          onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))}
        />
        <button className="primary-button" disabled={submitting} type="submit">
          {submitting ? "Adding..." : "Add task card"}
        </button>
      </form>
    </article>
  );
}

export default ListColumn;
