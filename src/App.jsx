import "./App.css";

import TaskList from "./components/tasklist/TaskList.jsx";

function App() {
  return (
    <div style={{ padding: 25 }}>
      <h1>TaskList App</h1>

      <TaskList title="To Do List" />
    </div>
  );
}

export default App;
