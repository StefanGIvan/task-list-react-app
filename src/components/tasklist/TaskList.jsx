import { useState, useEffect } from "react";

import TaskItem from "./TaskItem";

import useLocalStorage from "./../../hooks/useLocalStorage.jsx";

import logger from "../../lib/logger.js";

import "./TaskList.css";

import EmptyState from "./EmptyState.jsx";

const log = logger("[TaskList]", true);

export default function TaskList() {
  // Keep track of the state of tasks & text
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [text, setText] = useState("");

  //Log how much tasks we have on start
  useEffect(() => {
    log("TaskList mounted with: ", tasks.length, " tasks");
  }, []);

  // Add new task
  function addTask(event) {
    event.preventDefault();

    const taskText = text.trim();
    if (!taskText) {
      return;
    }

    /* setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: taskText },
    ]); */

    // Add a new task object to the list
    setTasks(function (previousTasks) {
      const updatedTasks = [...previousTasks];

      const newTask = {
        id: Date.now().toString(), //returns the current timestamp in ms => number => string
        title: text,
      };

      updatedTasks.push(newTask);

      return updatedTasks;
    });

    setText("");

    log("Task added:", taskText);
  }

  function toggleChecked(id, checked) {
    setTasks(function (previousTasks) {
      //make a new array based on the old one
      const updatedTasks = previousTasks.map(function (task) {
        //if the task is found
        if (task.id === id) {
          //copy all its old properties and update checked
          return {
            ...task,
            checked: checked,
          };
        } else {
          //otherwise leave the task as it is
          return task;
        }
      });
      //return the new array
      return updatedTasks;
    });

    log("Toggled checked:", id, checked);
  }

  // Delete a task by ID
  function deleteTask(id) {
    setTasks(function (previousTasks) {
      const updatedTasks = previousTasks.filter(function (task) {
        return !(task.id == id && task.checked);
      });

      return updatedTasks;
    });

    log("Task deleted:", id);
  }

  function toggleCompleted(id, completed) {
    setTasks(function (previousTasks) {
      const updatedTasks = previousTasks.map(function (task) {
        if (task.id === id && task.checked) {
          return { ...task, completed: completed };
        } else {
          return task;
        }
      });

      return updatedTasks;
    });
  }

  //JSX
  return (
    <div className="tasklist-container">
      <section className="tasklist-card tasklist-form-card">
        <h2 className="tasklist-title">To Do List</h2>

        <form className="tasklist-form" onSubmit={addTask}>
          <input
            className="tasklist-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write a task..."
          />
          <button className="tasklist-button" type="submit">
            Add
          </button>
        </form>
      </section>

      <section className="tasklist-card tasklist-items-card">
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="tasklist-items-container">
            {tasks.map((task) => (
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
      <footer className="tasklist-footer">
        <p>
          {tasks.length} {tasks.lenngth === 1 ? "task" : "tasks"} total
        </p>
      </footer>
    </div>
  );
}
