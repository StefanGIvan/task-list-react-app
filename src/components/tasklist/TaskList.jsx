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
//should not init at the start of the app if we have other code not needed to render from the start*
const manager = TaskListManager.getInstance();

const log = Logger("[TaskList]", true);

export default function TaskList() {
  //UI state - hold the current list and text input
  //the data lives in the manager
  const [selectedTaskArray, setSelectedTaskArray] = useState([]);
  const [taskArray, setTaskArray] = useState(manager.getList());
  const [taskText, setTaskText] = useState("");

  //On mount, sync the component data with the manager
  //init dispatch function redux read localStorage*
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
  // Toggle the checked state of a specific task
  function updateChecked(taskId, isChecked) {
    //move functions from manager to tasklist; can stay in manager but can take a parameter(setSelectedTaskArray)
    //remove logic of check from manager
    //check just here where we have the array

    //take the array and update the checked property
    setSelectedTaskArray((previousTasks) => {
      const index = findIndexTask(previousTasks, taskId);

      //for re-rendering
      let newArray = [...previousTasks];
      newArray[index] = { ...newArray[index], checked: isChecked };
      return newArray;
    });

    log("[updateChecked] Toggled checked: ", taskId, " Value: ", isChecked);
  }

  function findIndexTask(taskArray, taskId) {
    const index = taskArray.findIndex((task) => task.id === taskId);

    if (index === -1) {
      log("[updateChecked] task index not found: ", taskId);

      return false;
    }

    return index;
  }

  // Deletes a task only if it's checked (from TaskItem)
  function deleteTask(taskId) {
    setTaskArray(manager.deleteTask(taskId));
    //logs
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
