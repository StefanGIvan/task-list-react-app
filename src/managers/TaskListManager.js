import logger from "../lib/logger";

const log = logger("[TaskListManager]", true);

export default class TaskListManager {
  static #instance = null;

  static getInstance() {
    if (!TaskListManager.#instance) {
      TaskListManager.#instance = new TaskListManager();
    }
    return TaskListManager.#instance;
  }

  constructor() {
    //prevent TaskListManager from outside -> in this way we have only one instance on that class on the entire app (that defines a singleton)
    if (TaskListManager.#instance) {
      log.error("Use TaskListManager.getInstance()");
    }
  }

  // Need taskArray to represent the current array (since useState is not used)
  // Need trimTaskText property of obj to set title (since useState is not used)
  addTask(taskArray, { taskText }) {
    //if taskText is null/undefined, have a fallback
    taskText = taskText ?? "";
    const trimTaskText = taskText.trim();
    if (!trimTaskText) {
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: trimTaskText,
      checked: false,
      completed: false,
    };

    log("Task added: ", trimTaskText);

    return [...taskArray, newTask];
  }

  toggleChecked(taskArray, id, { isChecked }) {
    log("Toggled checked: ", id, isChecked);
    return taskArray.map((task) =>
      taskArray.id === id ? { ...task, checked: isChecked } : task
    );
  }

  deleteTask(taskArray, { taskId }) {
    log("Task deleted: ", taskId);
    log("taskArray length: ", taskArray.length);
    return taskArray.filter((task) => task.id !== taskId);
  }

  toggleCompleted(taskArray, { taskId }, { isCompleted }) {
    log("Task completed: ", taskId);
    return taskArray.map((task) =>
      task.id === taskId ? { ...task, completed: isCompleted } : task
    );
  }

  completeSelected(taskArray) {
    const completedTasksCount = taskArray.filter(
      (task) => task.checked && !task.completed
    ).length;
    log("Completed tasks: ", completedTasksCount);

    return taskArray.map((task) =>
      task.checked ? { ...task, completed: true } : task
    );
  }

  deleteSelected(taskArray) {
    const deletedTasks = taskArray.filter((task) => task.checked).length;
    log("Deleted tasks: ", deletedTasks);

    return taskArray.filter((task) => !task.checked);
  }
}
