// State is actually a Proxy from Immer.js
// Action (object) - needed when reducer uses data sent from a component (not state)
// action.payload - data dispatch sends

import { createSlice } from "@reduxjs/toolkit";

//store will override this with persisted data on load
const initialState = [];

// Defining where the data lives and how the data can be changed
const TaskListSlice = createSlice({
  name: "tasks", //what part of the app's data this slice controls (semantic)
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        const { title, priority } = action.payload;

        if (!title) {
          //just return the unchanged state
          return state;
        }

        const newTask = {
          id: crypto.randomUUID(),
          title,
          completed: false,
          date: new Date().toISOString(),
          priority, //0=None, 1=Low, 2=Medium, 3=High
        };
        return [...state, newTask];
      },
    },

    // Complete/Uncomplete a task
    // State is not mutated - map creates a new array and returns
    toggleCompleted(state, action) {
      //payload
      const { taskId, isCompleted } = action.payload;

      return state.map((task) =>
        task.id === taskId ? { ...task, completed: isCompleted } : task
      );
    },

    // Case for deleting a task
    deleteTask(state, action) {
      const taskId = action.payload;
      return state.filter((task) => task.id !== taskId);
    },

    // Complete/Uncomplete selected
    completeSelected(state, action) {
      const taskIds = new Set(action.payload);

      return state.map((task) =>
        taskIds.has(task.id) ? { ...task, completed: true } : task
      );
    },

    // Not mutating the original array, creates a brand new array so need to return
    // We only return something if we are replacing the entire array
    // Delete selected
    deleteSelected(state, action) {
      const taskIds = new Set(action.payload);

      return state.filter((task) => !taskIds.has(task.id));
    },
  },
});

// Extract & export all the actions creators (dispatch actions)
export const {
  addTask,
  toggleCompleted,
  deleteTask,
  completeSelected,
  deleteSelected,
} = TaskListSlice.actions;

//export the state from here
export const selectTaskList = (state) => state.tasks;

export default TaskListSlice.reducer;
