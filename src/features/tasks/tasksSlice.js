// State is actually a Proxy from Immer.js
// Action needed when reducer uses data sent from a component (not state) 
// action - object
// action.payload - data dispatch sends

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
      //payload
      const { taskId, isChecked } = action.payload;

      const findTask = state.find((task) => task.id === taskId);

      if (findTask) {
        findTask.checked = isChecked;
      },
    },

    // Complete/Uncomplete a task
    updateCompleted(state, action) {
      //payload
      const { taskId, isCompleted } = action.payload;

      const findTask = state.find((task) => task.id === taskId);

      if(findTask) {
        findTask.completed = isCompleted;
      }
    },

    // Complete/Uncomplete selected
    completeSelected(state) {
      return state.forEach((task) => {
        if(task.checked) {
          task.completed = true;
        }
      });
    },

    // Not mutating the original array, creates a brand new array so need to return
    // We only return something if we are replacing the entire array
    // Delete selected
    deleteSelected(state) {
      return state.filter((task) => !task.checked);
    },

    // Uncheck inputs
    clearChecks(state) {
      state.forEach((task) => {task.checked = false});
    },
  },
});

// Extract & export all the actions creators (dispatch actions)
export const {
  addTask,
  updateChecked,
  deleteTask,
  updateCompleted,
  completeSelected,
  deleteSelected,
  clearChecks,
} = TaskListSlice.actions;


// Read specific data from Redux store (instead of manually drilling state)
export const selectTasks = state => state.taskArray;
export const selectTotalCount = state => state.taskArray.length;
export const selectedCount = state => state.taskArray.filter((task) => task.checked).length;

export default TaskListSlice.reducer;

