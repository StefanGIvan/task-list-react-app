// Singleton Method Design
import logger from "../lib/logger";

const log = logger("[TaskListManager]", true);

export default class TaskListManager {
  static _instance = null;
  _tasks = [];

  static getInstance() {
    if (!TaskListManager._instance) {
      TaskListManager._instance = new TaskListManager();
    }
    return TaskListManager._instance;
  }

  constructor() {
    //prevent TaskListManager from outside -> in this way we have only one instance on that class on the entire app (that defines a singleton)
    if (TaskListManager._instance) {
      log.error("Use TaskListManager.getInstance()");
    }

    const savedValue = localStorage.getItem("taskArray");

    if (savedValue) {
      try {
        this._tasks = JSON.parse(savedValue);
      } catch {
        this._tasks = [];
      }
    }
  }

  _saveLocalStorage() {
    const stringifiedValue = JSON.stringify(this._tasks);
    localStorage.setItem("taskArray", stringifiedValue);
  }

  getSelectedCount() {
    return this._tasks.filter((task) => task.checked).length;
  }

  getTotalCount() {
    return this._tasks.length;
  }

  getList() {
    //return the copy of the array
    return [...this._tasks];
  }

  // Need taskArray to represent the current array (since useState is not used)
  // Need trimTaskText property of obj to set title (since useState is not used)
  addTask(taskText) {
    //if taskText is null/undefined, have a fallback
    taskText = taskText ?? "";
    const trimTaskText = taskText.trim();
    if (!trimTaskText) {
      return this.getList();
    }

    const newTask = {
      id: Date.now().toString(),
      title: trimTaskText,
      checked: false,
      completed: false,
    };

    this._tasks = [...this._tasks, newTask];

    this._saveLocalStorage();

    log("Task added: ", trimTaskText);

    return this.getList();
  }

  toggleChecked(id, isChecked) {
    this._tasks = this._tasks.map((task) =>
      task.id === id ? { ...task, checked: isChecked } : task
    );

    this._saveLocalStorage();

    log("Toggled checked: ", id, isChecked);

    return this.getList();
  }

  deleteTask(taskId) {
    this._tasks = this._tasks.filter((task) => task.id !== taskId);

    this._saveLocalStorage();

    log("Task deleted: ", taskId);

    return this.getList();
  }

  toggleCompleted(taskId, isCompleted) {
    this._tasks = this._tasks.map((task) =>
      task.id === taskId ? { ...task, completed: isCompleted } : task
    );

    this._saveLocalStorage();

    log("Task completed: ", taskId);

    return this.getList();
  }

  completeSelected() {
    const checkedCount = this._tasks.filter(
      (task) => task.checked && !task.completed
    ).length;

    this._tasks = this._tasks.map((task) =>
      task.checked ? { ...task, completed: true } : task
    );

    this._saveLocalStorage();

    log("Completed tasks: ", checkedCount);

    return this.getList();
  }

  deleteSelected() {
    const deletedTasks = this._tasks.filter((task) => task.checked).length;

    this._tasks = this._tasks.filter((task) => !task.checked);

    this._saveLocalStorage();

    log("Deleted tasks: ", deletedTasks);

    return this.getList();
  }
}
