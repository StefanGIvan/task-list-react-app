// configureStore - create Redux store
// combineReducers - merge multiple slice reducers into one root reducer
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// persistReducer - wraps reducer so state is auto-saved/auto-loaded
// persistStore - create a persistor object that coordinates loading
import { persistReducer, persistStore } from "redux-persist";

// storage engine
import storage from "redux-persist/lib/storage";

// the slice reducer (rootReducer)
import tasksReducer from "../features/tasks/tasksSlice";

// Take all slices and combine them
const rootReducer = combineReducers({
  tasks: tasksReducer,
});

const persistConfig = {
  key: "root", //save under the key: root (in localStorage persist:root)
  storage, //use localStorage
  whitelist: ["tasks"], //slice to persist
};

// On startup: rehydrate from storage into Redux
// On updates: write new state to storage
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Build the store with the wrapped persistedReducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // allow this actions
      },
    }),
});

// Create the persistor controller that will be passed to <PersistGate> (main.jsx) - UI waits until rehydration is finished
export const persistor = persistStore(store);
