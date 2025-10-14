import { useState, useEffect } from "react";

import TaskItem from "./TaskItem";

import useLocalStorage from "./../../hooks/useLocalStorage.jsx";

import logger from "../../lib/logger.js";

import "./TaskList.css";

import EmptyState from "./EmptyState.jsx";

import HeaderActions from "./HeaderActions.jsx";

const log = logger("[TaskList]", true);

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

    const trimTaskText = taskText.trim();
    if (!trimTaskText) {
      return;
    }

    /* setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: trimmedTaskText },
    ]); */

    // Add a new task object to the list
    setTaskArray(function (previousTasks) {
      const updatedTasks = [...previousTasks];

      const newTask = {
        id: Date.now().toString(), //returns the current timestamp in ms => number => string (from React)
        title: trimTaskText,
        checked: false,
        completed: false,
      };

      updatedTasks.push(newTask);

      return updatedTasks;
    });

    setTaskText("");

    log("Task added:", trimTaskText);
  }

  // Handles checking/unchecking a task (from TaskItem)
  function toggleChecked(taskId, isChecked) {
    setTaskArray(function (previousTasks) {
      //make a new array based on the old one
      const updatedTasks = previousTasks.map(function (task) {
        //if the task is found
        if (task.id === taskId) {
          //copy all its old properties and update checked
          return {
            ...task,
            checked: isChecked,
          };
        } else {
          //otherwise leave the task as it is
          return task;
        }
      });
      //return the new array
      return updatedTasks;
    });

    log("Toggled checked:", taskId, isChecked);
  }

  // Deletes a task only if it's checked (from TaskItem)
  function deleteTask(taskId) {
    setTaskArray(function (previousTasks) {
      const updatedTasks = previousTasks.filter(function (task) {
        return task.id !== taskId;
      });

      return updatedTasks;
    });

    log("Task deleted: ", taskId);
    log("taskArray length: ", totalCount);
  }

  // Mark a task as completed/uncompleted, if it's checked (from TaskItem)
  function toggleCompleted(taskId, isCompleted) {
    setTaskArray(function (previousTasks) {
      const updatedTasks = previousTasks.map(function (task) {
        if (task.id === taskId) {
          return { ...task, completed: isCompleted };
        } else {
          return task;
        }
      });

      return updatedTasks;
    });
    log("Task completed: ", taskId);
  }

  // Mark all checked tasks as completed (from HeaderActions)
  function completeSelected() {
    setTaskArray(function (previousTasks) {
      const updatedTasks = previousTasks.map((task) => {
        if (task.checked) {
          return { ...task, completed: true, checked: false };
        } else {
          return task;
        }
      });
      let completedTasks = previousTasks.length - updatedTasks.length;
      log("Completed tasks: ", completedTasks);
      return updatedTasks;
    });
  }

  // Delete all tasks that are checked (from HeaderActions)
  function deleteSelected() {
    setTaskArray(function (previousTasks) {
      const updatedTasks = previousTasks.filter((task) => {
        return !task.checked;
      });
      let deletedTasks = previousTasks.length - updatedTasks.length;
      log("Deleted tasks: ", deletedTasks);
      return updatedTasks;
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
