import { createSlice } from "@reduxjs/toolkit";

import Logger from "../../lib/logger";

//constant that stores the string key used in localStorage
const LS_KEY = "taskArray";

const log = logger("[TaskList]", true);

// Get from localStorage
function loadLocalStorage() {
  try {
    const storedValue = localStorage.getItem(LS_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedStorage = JSON.parse(storedValue);

    //for every element, make sure checked is false after refresh
    return parsedStorage.map((task) => ({ ...task, checked: false }));
  } catch (error) {
    log.error("Error occured in loading localStorage: ", error);

    return [];
  }
}

// Update localStorage
function persistTasks(taskArray) {
  const cleanTasks = taskArray.map(({ checked, ...rest }) => rest);
  localStorage.setItem("taskArray", JSON.stringify(cleanTasks));
}

// Array starting point
const initialState = loadLocalStorage();

// Defining where the data lives and how the data can be changed
const TaskListSlice = createSlice({
  name: "tasks", //what part of the app's data this slice controls (semantic)
  initialState,
  reducers: {
    addTask: {
      prepare(title) {
        const trimText = (title ?? "").trim();
        return { payload: trimText };
      },
      reducer(state, action) {
        const title = action.payload;

        if (!title) {
          return;
        }

        state.push({
          id: Date.now().toString(),
          title,
          checked: false,
          completed: false,
        });
      },
    },

    // Case for deleting a task
    deleteTask(state, action) {
      const taskId = action.payload;
      return state.filter((task) => task.id !== taskId);
    },

    // Check/Uncheck a task
    updateChecked(state, action) {
      const { taskId, isChecked } = action.payload;

      const findTask = state.find((task) => task.id === taskId);

      if (findTask) {
        findTask.checked = isChecked;
      },
    },
  },
});
