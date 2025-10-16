// Singleton Method Design
// This class manages all task-related data and ensures there's only one source of truth
// Handles persistence via localStorage
// Has methods that modify and return the updated list
import logger from "../lib/logger";

const log = logger("[TaskListManager]", true);

export default class TaskListManager {
  //static property holding the single instance
  static _instance = null;
  //private array that stores the tasks in current memory
  _taskArray = [];

  //returns the single instance of TaskListManager, so an instance holds all tasks
  //if it doesn't exist yet, it creates it
  static getInstance() {
    if (!TaskListManager._instance) {
      TaskListManager._instance = new TaskListManager();
    }
    return TaskListManager._instance;
  }

  //Private constructor
  constructor() {
    //prevent direct instantiation using "new TaskListManager()"
    //the first time, _instance is still null so it doesn't trigger the error
    //block the creation
    if (TaskListManager._instance) {
      throw new Error("[constructor] Use TaskListManager.getInstance()");
    }

    //Load persisted tasks from localStorage/else create an array
    const savedValue = localStorage.getItem("taskArray");

    if (savedValue) {
      try {
        this._taskArray = JSON.parse(savedValue);
        log("[constructor] Array parsed successfully");
      } catch {
        this._taskArray = [];
        log("[constructor] Array is assigned empty");
      }
    }
  }

  //Save the current task array to localStorage
  //Used after every operation that modifies _taskArray
  _persistTasks() {
    const stringifiedValue = JSON.stringify(this._taskArray);
    localStorage.setItem("taskArray", stringifiedValue);
    log("[_persistTasks] Persisted localStorage");
  }

  //Returns the number of tasks that are currently checked
  selectedCount() {
    return this._taskArray.filter((task) => task.checked).length;
  }

  //Returns the total number of tasks stored
  totalCount() {
    return this._taskArray.length;
  }

  //Return the copy of the array
  getList() {
    return [...this._taskArray];
  }

  //Add a new task to the list
  addTask(taskText) {
    //if taskText is null/undefined, have a fallback
    taskText = taskText ?? "";
    const trimTaskText = taskText.trim();
    //if the text is empty, don't create a new task
    if (!trimTaskText) {
      log("[addTask] Task Input was empty");
      return this.getList();
    }

    const newTask = {
      id: Date.now().toString(),
      title: trimTaskText,
      checked: false,
      completed: false,
    };

    //append new task and persist
    this._taskArray = [...this._taskArray, newTask];
    this._persistTasks();

    log("[addTask] Task added:", trimTaskText);

    return this.getList();
  }

  //Toggle the checked state of a specific task
  updateChecked(id, isChecked) {
    this._taskArray = this._taskArray.map((task) =>
      task.id === id ? { ...task, checked: isChecked } : task
    );

    this._persistTasks();

    log("[updateChecked] Toggled checked: ", id, " Value: ", isChecked);

    return this.getList();
  }

  //Deletes the task
  deleteTask(taskId) {
    this._taskArray = this._taskArray.filter((task) => task.id !== taskId);

    this._persistTasks();

    log("[deleteTask] Task deleted: ", taskId);

    return this.getList();
  }

  //Marks a specific task completed/uncompleted
  updateCompleted(taskId, isCompleted) {
    this._taskArray = this._taskArray.map((task) =>
      task.id === taskId ? { ...task, completed: isCompleted } : task
    );

    this._persistTasks();

    log("[updateCompleted] Task completed: ", taskId, " Value: ", isCompleted);

    return this.getList();
  }

  //Marks all the checked tasks as completed
  //Logs the number of completed tasks by counting them before modifing the array
  completeSelected() {
    const checkedTasksCount = this._taskArray.filter(
      (task) => task.checked
    ).length;

    const selectedTasks = this._taskArray.filter((task) => task.checked);

    this._taskArray = this._taskArray.map((task) =>
      task.checked ? { ...task, completed: true } : task
    );

    this._persistTasks();

    selectedTasks.forEach((task) =>
      log("[completeSelected] Completed tasks: ", task.id)
    );
    log("[completeSelected] Completed tasks: ", checkedTasksCount);

    return this.getList();
  }

  //Deletes all checked tasks
  //Logs how many tasks were removed
  deleteSelected() {
    //Determine how many tasks will be deleted
    const deletedTasksCount = this._taskArray.filter(
      (task) => task.checked
    ).length;

    //Retain deleted in an array for log
    const deletedTasks = this._taskArray.filter((task) => task.checked);

    this._taskArray = this._taskArray.filter((task) => !task.checked);

    this._persistTasks();

    deletedTasks.forEach((task) =>
      log("[deleteSelected] Task deleted: ", task.id)
    );
    log("[deleteSelected] Deleted count: ", deletedTasksCount);

    return this.getList();
  }
}
