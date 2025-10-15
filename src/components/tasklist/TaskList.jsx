import { useState, useEffect } from "react";

import TaskItem from "./TaskItem";

import useLocalStorage from "./../../hooks/useLocalStorage.jsx";

import logger from "../../lib/logger.js";

import "./TaskList.css";

import EmptyState from "./EmptyState.jsx";

import HeaderActions from "./HeaderActions.jsx";

import TaskListManager from "../../managers/TaskListManager.js";

const log = logger("[TaskList]", true);

const manager = TaskListManager.getInstance();

export default function TaskList() {
  // Keep track of the state of taskArray & taskText
  const [taskArray, setTaskArray] = useLocalStorage("taskArray", []);
  const [taskText, setTaskText] = useState("");

  const totalCount = taskArray.length;
  const checkedTasks = taskArray.filter((task) => {
    return task.checked === true;
  });
  const selectedCount = checkedTasks.length;

  // Log on start once (on mount)
  useEffect(() => {
    log("TaskList mounted");
  }, []);

  //Log the length of the taskArray every time it is modified (not just the length)
  useEffect(() => {
    log("Current nr. of tasks: ", taskArray.length);
  }, [taskArray]);

  // Add new task
  function addTask(event) {
    event.preventDefault();

    // Add a new task object to the list
    setTaskArray(function (previousTasks) {
      //pass taskText as object literal(taskText: taskText, created on the spot)
      return manager.addTask(previousTasks, taskText);
    });

    setTaskText("");
  }

  // Handles checking/unchecking a task (from TaskItem)
  function toggleChecked(taskId, isChecked) {
    setTaskArray(function (previousTasks) {
      return manager.toggleChecked(previousTasks, taskId, isChecked);
    });
  }

  // Deletes a task only if it's checked (from TaskItem)
  function deleteTask(taskId) {
    setTaskArray(function (previousTasks) {
      return manager.deleteTask(previousTasks, taskId);
    });
  }

  // Mark a task as completed/uncompleted, if it's checked (from TaskItem)
  function toggleCompleted(taskId, isCompleted) {
    setTaskArray(function (previousTasks) {
      return manager.toggleCompleted(previousTasks, taskId, isCompleted);
    });
  }

  // Mark all checked tasks as completed (from HeaderActions)
  function completeSelected() {
    setTaskArray(function (previousTasks) {
      return manager.completeSelected(previousTasks);
    });
  }

  // Delete all tasks that are checked (from HeaderActions)
  function deleteSelected() {
    setTaskArray(function (previousTasks) {
      return manager.deleteSelected(previousTasks);
    });
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
        selectedCount={selectedCount}
        totalCount={totalCount}
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
