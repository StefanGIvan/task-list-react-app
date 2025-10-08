import { useState } from "react";
import "./App.css";

function App() {
  // 1) Keep track of the state of tasks & text
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  function addTask(event) {
    event.preventDefault();

    const taskText = taskText.trim();
    if (!taskText) {
      return;
    }

    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: taskText },
    ]);

    setText("");
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return (
    <div style={{ padding: 25, maxWidth: 500, margin: "0 auto" }}>
      <h1>Task List</h1>
      <form onSubmit={addTask}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a task..."
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}{" "}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
