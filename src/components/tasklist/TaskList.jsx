// UI component responsible for rendering and updating the task list
// Delegates state management and data persistance to TaskListManager (Singleton)

import { useState, useEffect } from "react";

import TaskItem from "./TaskItem";

import HeaderActions from "./HeaderActions";

import EmptyState from "./EmptyState";

import TaskListManager from "../../managers/TaskListManager.js";

import Logger from "../../lib/logger.js";

import "./styles/TaskList.css";

//get the global singleton instance
const manager = TaskListManager.getInstance();

const log = new Logger();

export default function TaskList() {
  //UI state - hold the current list and text input
  //the data lives in the manager
  const [taskArray, setTaskArray] = useState(manager.getList());
  const [taskText, setTaskText] = useState("");

  //On mount, sync the component data with the manager
  useEffect(() => {
    setTaskArray(manager.getList());

    log("Mounted");
  }, []);

  // Add new task
  function addTask(event) {
    event.preventDefault();

    setTaskArray(manager.addTask(taskText));

    setTaskText("");
  }

  // Handles checking/unchecking a task (from TaskItem)
  function updateChecked(taskId, isChecked) {
    setTaskArray(manager.updateChecked(taskId, isChecked));
  }

  // Deletes a task only if it's checked (from TaskItem)
  function deleteTask(taskId) {
    setTaskArray(manager.deleteTask(taskId));
  }

  // Mark a task as completed/uncompleted, if it's checked (from TaskItem)
  function updateCompleted(taskId, isCompleted) {
    setTaskArray(manager.updateCompleted(taskId, isCompleted));
  }

  // Mark all checked tasks as completed (from HeaderActions)
  function completeSelected() {
    setTaskArray(manager.completeSelected());
  }

  // Delete all tasks that are checked (from HeaderActions)
  function deleteSelected() {
    setTaskArray(manager.deleteSelected());
  }

  //UI Rendering
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
        selectedCount={manager.selectedCount()}
        totalCount={manager.totalCount()}
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
                onUpdateChecked={updateChecked}
                onToggleCompleted={updateCompleted}
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
