// UI component responsible for rendering and updating the task list
// Delegates state management and data persistance to TaskListManager (Singleton)

import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import {
  addTask as addTaskAction,
  deleteTask as deleteTaskAction,
  toggleCompleted as toggleCompletedAction,
  completeSelected as completeSelectedAction,
  deleteSelected as deleteSelectedAction,
} from "../../features/tasks/tasksSlice.js";

import TaskItem from "./TaskItem";

import HeaderActions from "./HeaderActions";

import EmptyState from "./EmptyState";

import Logger from "../../lib/logger.js";

import "./styles/TaskList.css";

import { toast } from "react-hot-toast";

const log = Logger("[TaskList]", true);

export default function TaskList() {
  //UI state - hold the current list and text input
  //the data lives in the manager
  const [selectedTaskArray, setSelectedTaskArray] = useState([]); //checked state array with ids
  const [taskText, setTaskText] = useState("");

  const dispatch = useDispatch();
  //allow TaskList to access Redux data - return the array of tasks from store
  const taskArray = useSelector((state) => state.tasks);

  const isAllChecked =
    taskArray.length > 0 && selectedTaskArray.length === taskArray.length;

  // Add new task
  function addTask(event) {
    event.preventDefault();

    //catch .trim before it enters Redux
    if (taskText.trim()) {
      dispatch(addTaskAction(taskText));

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

  function toggleCheckAll(isCheckAll) {
    if (isCheckAll) {
      setSelectedTaskArray(taskArray.map((task) => task.id));

      log("All tasks checked");
    } else {
      setSelectedTaskArray([]);

      log("All tasks unchecked");
    }
  }

  // Deletes a task only if it's checked (from TaskItem)
  function deleteTask(taskId) {
    dispatch(deleteTaskAction(taskId));

    //remove id for checked from the array
    const updateSelectedTaskArray = selectedTaskArray.filter(
      (id) => id !== taskId
    );
    setSelectedTaskArray(updateSelectedTaskArray);

    toast.success("Task deleted");
  }

  // Mark a task as completed/uncompleted, if it's checked (from TaskItem)
  function toggleCompleted(taskId, isCompleted) {
    dispatch(toggleCompletedAction({ taskId, isCompleted }));

    //remove id for checked from the array
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
    dispatch(completeSelectedAction(selectedTaskArray));

    //remove every id from the array
    setSelectedTaskArray([]);

    toast.success("Tasks completed!");
  }

  // Delete all tasks that are checked (from HeaderActions)
  function deleteSelected() {
    dispatch(deleteSelectedAction(selectedTaskArray));

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
        totalCount={taskArray.length}
        selectedCount={selectedTaskArray.length}
        onCompleteSelected={completeSelected}
        onDeleteSelected={deleteSelected}
        onToggleSelectAll={toggleCheckAll}
        isAllChecked={isAllChecked}
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
