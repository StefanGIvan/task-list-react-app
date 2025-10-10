// A single row in TaskList
// Keeps no state of its own
// Calls the callbacks it receives from TaskList.jsx

//props sent from the parent

import "./TaskItem.css";

export default function TaskItem({
  task,
  onDelete,
  onToggleChecked,
  onToggleCompleted,
}) {
  const handleChecked = (event) => {
    if (onToggleChecked) {
      onToggleChecked(task.id, event.target.checked);
    }
  };

  const handleDelete = () => {
    if (!task.checked) {
      return;
    }
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const handleCompleted = () => {
    if (!task.checked) {
      return;
    }
    if (onToggleCompleted) {
      onToggleCompleted(task.id, !task.completed);
    }
  };

  return (
    <li className={"task-item" + (task.completed ? " completed" : "")}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.checked}
        onChange={handleChecked}
      />

      <span className="task-title">{task.title}</span>
      {task.completed && <span className="task-label">Done</span>}

      <div className="task-actions">
        <button
          type="button"
          className="task-edit-btn"
          onClick={handleCompleted}
        >
          {task.completed ? "Undo" : "Complete"}
        </button>

        <button
          type="button"
          className="task-delete-btn"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
