import { configureStore } from "@reduxjs/toolkit";

import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

// Import the reducers + actions from the slice
import tasksReducer, {
  addTask,
  toggleCompleted,
  deleteTask,
  completeSelected,
  deleteSelected,
} from "../features/tasks/tasksSlice";

import Logger from "../lib/logger";

// Reusable key for localStorage
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
    //read latest store state (api.getState())
    //.tasks - slice key
    const currentTasks = api.getState().tasks;
    localStorage.setItem(LS_KEY, JSON.stringify(currentTasks));
  },
});

// configureStore - creates a single store instance
// export to the slice
export const store = configureStore({
  //each field represents one slice of the state
  reducer: {
    tasks: tasksReducer,
  },
  //On page load: store starts with saved tasks
  preloadedState: { tasks: loadLocalStorage() },
  //get default middleware from Redux Toolkit then add the listener middleware created here
  middleware: (getDefault) => getDefault().concat(listener.middleware),
});
