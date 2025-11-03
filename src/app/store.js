import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { persistReducer, persistStore } from "redux-persist";

import storage from "redux-persist/lib/storage";

import tasksReducer from "../features/tasks/tasksSlice";

// Take all slices and combine them
const rootReducer = combineReducers({
  tasks: tasksReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["tasks"], //slice to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
