import TaskList from "./components/tasklist/TaskList.jsx";

import "./App.css";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="app-shell">
      <h1 className="app-title">TaskList App</h1>

      <TaskList title="To Do List" />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#383838",
            color: "#fff",
            borderRadius: "8px",
          },
        }}
      />
    </div>
  );
}

export default App;
