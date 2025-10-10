import TaskList from "./components/tasklist/TaskList.jsx";

import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <h1 className="app-title">TaskList App</h1>

      <TaskList title="To Do List" />
    </div>
  );
}

export default App;
