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
  isChecked,
  onDelete,
  onUpdateChecked,
  onToggleCompleted,
}) {
  // Functions that update the UI
  const handleChecked = () => {
    if (onUpdateChecked) {
      onUpdateChecked(task.id);
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

  // Function that verifies what priority a task has and shows a label for the UI
  function getPriorityLabel(priority) {
    switch (priority) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      default:
        return "None";
    }
  }

  return (
    <li className={"task-item" + (task.completed ? " completed" : "")}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={isChecked}
        onChange={handleChecked}
      />

      <span className="task-title">{task.title}</span>
      {task.completed && <span className="task-label">Done</span>}

      <span className="task-priority">{getPriorityLabel(task.priority)}</span>

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
