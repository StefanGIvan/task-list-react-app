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
  const [selectedTaskArray, setSelectedTaskArray] = useState([]); //checked state array with ids
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

  //function that verifies if checked id is in the array
  function isChecked(taskId) {
    return selectedTaskArray.includes(taskId);
  }

  // Handles checking/unchecking a task (from TaskItem)
  // Toggle the checked state of a specific task
  // Function that modifies the id
  function toggleChecked(taskId) {
    //move functions from manager to tasklist; can stay in manager but can take a parameter(setSelectedTaskArray)
    //remove logic of check from manager
    //check just here where we have the array

    //take the array and update the checked property
    if (isChecked(taskId)) {
      log("[toggleChecked] Toggle unchecked: ", taskId);

      setSelectedTaskArray(selectedTaskArray.filter((id) => id !== taskId));
      return;
    }
    log("[toggleChecked] Toggled checked: ", taskId);

    // return [...previousTasks, taskId];
    setSelectedTaskArray([...selectedTaskArray, taskId]);
  }

  // Deletes a task only if it's checked (from TaskItem)
  function deleteTask(taskId) {
    setTaskArray(manager.deleteTask(taskId));

    setSelectedTaskArray((previousTasks) =>
      previousTasks.filter((id) => id !== taskId)
    );
  }

  // Mark a task as completed/uncompleted, if it's checked (from TaskItem)
  function updateCompleted(taskId, isCompleted) {
    setTaskArray(manager.updateCompleted(taskId, isCompleted));
  }

  // Mark all checked tasks as completed (from HeaderActions)
  function completeSelected() {
    setTaskArray(manager.completeTasks(selectedTaskArray));
  }

  // Delete all tasks that are checked (from HeaderActions)
  function deleteSelected() {
    setTaskArray(manager.deleteTasks(selectedTaskArray));

    setSelectedTaskArray((previousTasks) =>
      previousTasks.filter((id) => !selectedTaskArray.includes(id))
    );
  }

  //UI Rendering
  return (
    <div className="tasklist-container">
      <section className="card tasklist-form-section">
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
        selectedCount={selectedTaskArray.length}
        totalCount={taskArray.length}
        onCompleteSelected={completeSelected}
        onDeleteSelected={deleteSelected}
      />

      <section className="card">
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
                onUpdateChecked={toggleChecked}
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
