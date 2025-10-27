import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";

// configureStore - creates a single store instance
export const store = configureStore({
  //each field represents one slice of the state
  reducer: {
    tasks: tasksReducer,
  },
});
