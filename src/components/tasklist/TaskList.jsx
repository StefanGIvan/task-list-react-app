import { useState } from "react";

import "../../App.css";

import TaskItem from "./TaskItem";

import logger from "../../lib/logger.js";

const log = logger("[TaskList]", true);

export default function TaskList() {
  // Keep track of the state of tasks & text
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  // Add new task
  function addTask(event) {
    event.preventDefault();

    const taskText = text.trim();
    if (!taskText) {
      return;
    }

    // Add a new task object to the list
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: taskText },
    ]);

    setText("");

    log("Task added:", taskText);
  }

  // Delete a task by ID
  function deleteTask(id) {
    setTasks(function (previousTasks) {
      const updatedTasks = previousTasks.filter(function (task) {
        return task.id !== id;
      });

      return updatedTasks;
    });

    log("Task deleted:", id);
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

  function toggleCompleted(id, completed) {
    setTasks(function (previousTasks) {
      const updatedTasks = previousTasks.map(function (task) {
        if (task.id === id) {
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
    <div style={{ padding: 25, maxWidth: 500, margin: "0 auto" }}>
      <h1>To Do List</h1>

      <form onSubmit={addTask}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a task..."
        />
        <button type="submit">Add</button>
      </form>

      <ul>
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
    </div>
  );
}
