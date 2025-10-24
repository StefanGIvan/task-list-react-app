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
  //different branches with different styles*
  //Private constructor
  constructor() {
    //Load persisted tasks from localStorage/else create an array
    const savedValue = localStorage.getItem("taskArray");

    if (savedValue) {
      try {
        this._taskArray = JSON.parse(savedValue);

        log("[constructor] Array parsed successfully");
      } catch (error) {
        log.error(
          "[constructor] Error occured when parsing local storage",
          error
        );
      }
    } else {
      this._taskArray = [];
      log("[constructor] Array is assigned empty");
    }
  }

  //Save the current task array to localStorage
  //Used after every operation that modifies _taskArray
  _persistTasks() {
    const stringifiedValue = JSON.stringify(this._taskArray);
    localStorage.setItem("taskArray", stringifiedValue);
    log("[_persistTasks] Persisted localStorage");
  }

  //Return the copy of the array/ return directly the task array
  getList() {
    return [...this._taskArray];
  }

  findIndex(taskId) {
    const index = this._taskArray.findIndex((task) => task.id === taskId);

    if (index === -1) {
      log("[updateChecked] task index not found: ", taskId);

      return -1;
    }

    return index;
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
      id: crypto.randomUUID(),
      title: trimTaskText,
      completed: false,
      date: new Date().toISOString(),
    };

    //append new task and persist
    this._taskArray = [...this._taskArray, newTask];
    this._persistTasks();

    log("[addTask] Task added:", trimTaskText);

    return this.getList();
  }

  //Deletes the task
  deleteTask(taskId) {
    const index = this.findIndex(taskId);

    if (index === -1) {
      log.error("[deleteTask] index of task not found: ", taskId);
      //return the list either way, so the UI doesn't break
      return this.getList();
    }

    this._taskArray.splice(index, 1);

    this._persistTasks();

    log("[deleteTask] Task deleted: ", taskId);

    return this.getList();
  }

  //find + boolean function*
  //Marks a specific task completed/uncompleted
  toggleCompleted(taskId, isCompleted) {
    const index = this.findIndex(taskId);

    if (index === -1) {
      log.error("[deleteTask] index of task not found: ", taskId);
      //return the list either way, so the UI doesn't break
      return this.getList();
    }

    this._taskArray[index].completed = isCompleted;

    this._persistTasks();

    log("[updateCompleted] Task completed: ", taskId, " Value: ", isCompleted);

    return this.getList();
  }

  //Marks all the checked tasks as completed
  //Logs the number of completed tasks by counting them before modifing the array
  completeTasks(taskIds) {
    //completeTasks(taskIds)
    //give the manager a list of tasks to be completed (a list of tasks or a list of task ids)
    console.log("[completeTasks] incoming:", taskIds, Array.isArray(taskIds));
    let idSet = new Set(taskIds);
    let completedCount = 0;

    //Set doesn't contain duplicates and .has() is faster than .includes() for large data
    this._taskArray = this._taskArray.map((task) => {
      if (idSet.has(task.id)) {
        completedCount++;
        return { ...task, completed: true };
      }
      return task;
    });

    this._persistTasks();

    taskIds.forEach((id) => log("[completeSelected] Completed tasks: ", id));
    log("[completeSelected] Completed tasks: ", completedCount);

    return this.getList();
  }

  //Deletes all checked tasks
  //Logs how many tasks were removed
  deleteTasks(taskIds) {
    let idSet = new Set(taskIds);

    //Set doesn't contain duplicates and .has() is faster than .includes() for large data
    const deletedTasks = this._taskArray.filter((task) => idSet.has(task.id));
    this._taskArray = this._taskArray.filter((task) => !idSet.has(task.id));

    const deletedCount = deletedTasks.length;

    this._persistTasks();

    taskIds.forEach((id) => log("[deleteSelected] Task deleted: ", id));
    log("[deleteSelected] Deleted count: ", deletedCount);

    return this.getList();
  }
}
