import { configureStore } from "@reduxjs/toolkit";

import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import tasksReducer, {
  addTask,
  toggleCompleted,
  deleteTask,
  completeSelected,
  deleteSelected,
} from "../features/tasks/tasksSlice";

import Logger from "../lib/logger";

//reusability
const LS_KEY = "taskArray";
const log = Logger("[store]", true);

function loadLocalStorage() {
  try {
    const loadStorage = localStorage.getItem(LS_KEY);
    const parsedStorage = JSON.parse(loadStorage);

    return Array.isArray(parsedStorage) ? parsedStorage : [];
  } catch (error) {
    log("Failed to load tasks from local storage: ", error);

    return [];
  }
}

//tool that can listen to actions
const listener = createListenerMiddleware();

//listener trigger when one of the specific actions happen
listener.startListening({
  matcher: isAnyOf(
    addTask,
    toggleCompleted,
    deleteTask,
    completeSelected,
    deleteSelected
  ),
  effect: async (_action, api) => {
    //read store state
    const tasks = api.getState().tasks;
    localStorage.setItem(LS_KEY, JSON.stringify(tasks));
  },
});

// configureStore - creates a single store instance
export const store = configureStore({
  //each field represents one slice of the state
  reducer: {
    tasks: tasksReducer,
  },
  //store starts with saved tasks
  preloadState: { tasks: loadLocalStorage() },
  //add middleware on listener
  middleware: (getDefault) => getDefault().concat(listener.middleware),
});
