import { useState, useEffect } from "react";

import TaskItem from "./TaskItem";

import "./TaskList.css";

import EmptyState from "./EmptyState.jsx";

import HeaderActions from "./HeaderActions.jsx";

import TaskListManager from "../../managers/TaskListManager.js";

const manager = TaskListManager.getInstance();

export default function TaskList() {
  const [taskArray, setTaskArray] = useState(manager.getList());
  const [taskText, setTaskText] = useState("");

  useEffect(() => {
    setTaskArray(manager.getList());
  }, []);

  // Add new task
  function addTask(event) {
    event.preventDefault();

    setTaskArray(manager.addTask(taskText));

    setTaskText("");
  }

  // Handles checking/unchecking a task (from TaskItem)
  function toggleChecked(taskId, isChecked) {
    setTaskArray(manager.toggleChecked(taskId, isChecked));
  }

  // Deletes a task only if it's checked (from TaskItem)
  function deleteTask(taskId) {
    setTaskArray(manager.deleteTask(taskId));
  }

  // Mark a task as completed/uncompleted, if it's checked (from TaskItem)
  function toggleCompleted(taskId, isCompleted) {
    setTaskArray(manager.toggleCompleted(taskId, isCompleted));
  }

  // Mark all checked tasks as completed (from HeaderActions)
  function completeSelected() {
    setTaskArray(manager.completeSelected());
  }

  // Delete all tasks that are checked (from HeaderActions)
  function deleteSelected() {
    setTaskArray(manager.deleteSelected());
  }

  //JSX
  return (
    <div className="tasklist-container">
      <section className="tasklist-card tasklist-form-card">
        <h2 className="tasklist-title">To Do List</h2>

        {/*Tasklist form*/}
        <form className="tasklist-form" onSubmit={addTask}>
          <input
            className="tasklist-input"
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
            placeholder="Write a task..."
          />
          <button className="tasklist-button" type="submit">
            Add
          </button>
        </form>
      </section>

      {/*Render HeaderActions between Tasklist form and Tasklist items*/}
      <HeaderActions
        selectedCount={manager.getSelectedCount()}
        totalCount={manager.getTotalCount()}
        onCompleteSelected={completeSelected}
        onDeleteSelected={deleteSelected}
      />

      <section className="tasklist-card tasklist-items-card">
        {/*If taskArray length is zero, show EmptyState card, else show the TaskItem*/}
        {taskArray.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="tasklist-items-container">
            {taskArray.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onToggleChecked={toggleChecked}
                onToggleCompleted={toggleCompleted}
              />
            ))}
          </ul>
        )}
      </section>

      {/*Footer that shows tasks number*/}
      <footer className="tasklist-footer">
        <p>
          {taskArray.length} {taskArray.length === 1 ? "task" : "tasks"} total
        </p>
      </footer>
    </div>
  );
}
