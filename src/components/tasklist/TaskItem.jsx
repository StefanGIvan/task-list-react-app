// A single row in TaskList
// Keeps no state of its own
// Calls the callbacks it receives from TaskList.jsx
//props sent from the parent
//sgv files can be imported directly as components (because of Vite)
import CompleteIcon from "../../assets/icons/complete.svg?react";

import DeleteIcon from "../../assets/icons/delete.svg?react";

import UndoIcon from "../../assets/icons/undo.svg?react";

import "./styles/TaskItem.css";

export default function TaskItem({
  task,
  onDelete,
  onUpdateChecked,
  onToggleCompleted,
}) {
  // Functions that update the UI
  const handleChecked = (event) => {
    if (onUpdateChecked) {
      onUpdateChecked(task.id, event.target.checked);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const handleCompleted = () => {
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
          className="task-complete-btn"
          onClick={handleCompleted}
        >
          {task.completed ? (
            <UndoIcon className="undo-icon" />
          ) : (
            <CompleteIcon className="complete-icon" />
          )}
        </button>

        <button
          type="button"
          className="task-delete-btn"
          onClick={handleDelete}
        >
          {<DeleteIcon className="delete-icon" />}
        </button>
      </div>
    </li>
  );
}
