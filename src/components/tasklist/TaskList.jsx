// UI component responsible for rendering and updating the task list
// Delegates state management and data persistance to TaskListManager (Singleton)

import { useState, useEffect } from "react";

import TaskItem from "./TaskItem";

import HeaderActions from "./HeaderActions";

import EmptyState from "./EmptyState";

import TaskListManager from "../../managers/TaskListManager.js";

import Logger from "../../lib/logger.js";

import "./styles/TaskList.css";

import { toast } from "react-hot-toast";

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

    if (taskText) {
      toast.success("Task added successfully!");
    } else {
      toast.error("Please enter a task before adding");
    }

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

    //remove id for checked from the array
    const updateSelectedTaskArray = selectedTaskArray.filter(
      (id) => id !== taskId
    );
    setSelectedTaskArray(updateSelectedTaskArray);

    toast.success("Task deleted");
  }

  // Mark a task as completed/uncompleted, if it's checked (from TaskItem)
  function toggleCompleted(taskId, isCompleted) {
    setTaskArray(manager.toggleCompleted(taskId, isCompleted));

    const updateSelectedTaskArray = selectedTaskArray.filter(
      (id) => id !== taskId
    );
    setSelectedTaskArray(updateSelectedTaskArray);

    if (isCompleted) {
      toast.success("Task completed!");
    } else {
      toast.success("Task uncompleted!");
    }
  }

  // Mark all checked tasks as completed (from HeaderActions)
  function completeSelected() {
    setTaskArray(manager.completeTasks(selectedTaskArray));

    //remove every id from the array
    setSelectedTaskArray([]);

    toast.success("Tasks completed!");
  }

  // Delete all tasks that are checked (from HeaderActions)
  function deleteSelected() {
    setTaskArray(manager.deleteTasks(selectedTaskArray));

    //remove every id from the array
    setSelectedTaskArray([]);

    toast.success("Tasks deleted!");
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
            {/*isChecked used to just update the UI checkbox*/}
            {taskArray.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isChecked={isChecked(task.id)}
                onDelete={deleteTask}
                onUpdateChecked={toggleChecked}
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
