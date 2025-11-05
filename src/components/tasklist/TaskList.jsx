// UI component responsible for rendering and updating the task list
// Delegates state management and data persistance to TaskListManager (Singleton)

import { useMemo, useState, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";

import { selectTaskList } from "../../features/tasks/tasksSlice.js";

import {
  addTask as addTaskAction,
  deleteTask as deleteTaskAction,
  toggleCompleted as toggleCompletedAction,
  completeSelected as completeSelectedAction,
  deleteSelected as deleteSelectedAction,
  taskTitleEdit as taskTitleEditAction,
} from "../../features/tasks/tasksSlice.js";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { reorder } from "../../features/tasks/tasksSlice.js";

import TaskItem from "./TaskItem";

import HeaderActions from "./HeaderActions";

import EmptyState from "./EmptyState";

import Logger from "../../lib/logger.js";

import "./styles/TaskList.css";

import { toast } from "react-hot-toast";

const log = Logger("[TaskList]", true);

export default function TaskList() {
  //UI state - hold the current list and text input
  //the data lives in the manager
  const [selectedTaskArray, setSelectedTaskArray] = useState([]); //checked state array with ids
  const [taskText, setTaskText] = useState("");
  const [sortMode, setSortMode] = useState("none");
  const [filterMode, setFilterMode] = useState("0");
  //state for the priority value
  const [taskPriority, setTaskPriority] = useState(0);

  const dispatch = useDispatch();
  //allow TaskList to access Redux data - return the array of tasks from store
  //exported from the store
  const taskArray = useSelector(selectTaskList);

  // visibleTaskArray will be what is sorted on what is filtered
  // useMemo so that they rerender when changed, not on every
  const visibleTaskArray = useMemo(() => {
    const filteredTasksArray = filterTasks(taskArray, filterMode);
    return sortTasks(filteredTasksArray, sortMode);
  }, [taskArray, filterMode, sortMode]);

  //tipNewFeature = { current: false }
  const tipNewFeature = useRef(true);

  // Show tip once per session
  useEffect(() => {
    const canReorder = sortMode === "none" && visibleTaskArray.length > 1;

    if (canReorder && tipNewFeature.current) {
      toast.success("Tip: Drag and Drop tasks ↕️");
      tipNewFeature.current = false;
    }
  }, [sortMode, visibleTaskArray.length]);

  const isAllChecked =
    visibleTaskArray.length > 0 &&
    selectedTaskArray.length === visibleTaskArray.length;

  // Array that holds tasks that are checked and visible in the same time (needed when using other filter and tasks were selected before)
  const visibleIdsArray = visibleTaskArray.filter((task) =>
    selectedTaskArray.includes(task.id)
  );

  // Add new task
  function addTask(event) {
    event.preventDefault();

    //catch .trim before it enters Redux
    //taskText.trim()* - lost
    const trimTaskText = taskText.trim();
    if (trimTaskText) {
      dispatch(addTaskAction({ title: trimTaskText, priority: taskPriority }));

      toast.success("Task added successfully!");
    } else {
      toast.error("Please enter a task before adding");
    }
    setTaskText("");
    setTaskPriority(0); //reset select
  }

  // Helper function that verifies if checked id is in the array
  function isChecked(taskId) {
    return selectedTaskArray.includes(taskId);
  }

  // Handles checking/unchecking a task (from TaskItem)
  function toggleChecked(taskId) {
    if (isChecked(taskId)) {
      log("[toggleChecked] Toggle unchecked: ", taskId);

      setSelectedTaskArray(selectedTaskArray.filter((id) => id !== taskId));
      return;
    }
    log("[toggleChecked] Toggled checked: ", taskId);

    // return [...previousTasks, taskId];
    setSelectedTaskArray([...selectedTaskArray, taskId]);
  }

  // Check/Uncheck all tasks
  function toggleCheckAll(isCheckAll) {
    if (isCheckAll) {
      setSelectedTaskArray(taskArray.map((task) => task.id));

      log("All tasks checked");
    } else {
      setSelectedTaskArray([]);

      log("All tasks unchecked");
    }
  }

  //preset = user selected mode
  function sortTasks(taskArray, preset) {
    const copyTasksArray = [...taskArray]; //do not mutate Redux state in render code so we make a copy of the array

    switch (preset) {
      case "date-asc":
        return copyTasksArray.sort(
          (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
      case "date-desc":
        return copyTasksArray.sort(
          (a, b) => Date.parse(b.date) - Date.parse(a.date)
        );
      case "priority-asc":
        return copyTasksArray.sort((a, b) => a.priority - b.priority);
      case "priority-desc":
        return copyTasksArray.sort((a, b) => b.priority - a.priority);
      default:
        return copyTasksArray;
    }
  }

  function filterTasks(taskArray, filter) {
    if (filter === "0") {
      return taskArray;
    }

    const actualFilter = Number(filter);

    return taskArray.filter((task) => task.priority === actualFilter);
  }

  // Deletes a task only if it's checked (from TaskItem)
  function deleteTask(taskId) {
    dispatch(deleteTaskAction(taskId));

    //remove id for checked from the array
    const updateSelectedTaskArray = selectedTaskArray.filter(
      (id) => id !== taskId
    );
    setSelectedTaskArray(updateSelectedTaskArray);

    toast.success("Task deleted");
  }

  // Mark a task as completed/uncompleted, if it's checked (from TaskItem)
  function toggleCompleted(taskId, isCompleted) {
    dispatch(toggleCompletedAction({ taskId, isCompleted }));

    //remove id for checked from the array
    const updateSelectedTaskArray = selectedTaskArray.filter(
      (id) => id !== taskId
    );
    setSelectedTaskArray(updateSelectedTaskArray);

    if (isCompleted) {
      toast.success("Task completed!");
    } else {
      toast.success("Task uncompleted!");
    }
  }

  // Mark all checked tasks as completed (from HeaderActions)
  function completeSelected() {
    dispatch(completeSelectedAction(selectedTaskArray));

    //remove every id from the array
    setSelectedTaskArray([]);

    toast.success("Tasks completed!");
  }

  // Delete all tasks that are checked (from HeaderActions)
  function deleteSelected() {
    dispatch(deleteSelectedAction(selectedTaskArray));

    //remove every id from the array
    setSelectedTaskArray([]);

    toast.success("Tasks deleted!");
  }

  function taskTitleEdit(taskId, newTitle) {
    dispatch(taskTitleEditAction({ taskId, newTitle }));
  }

  function handleDragEnd(result) {
    // result comes from @hello-pangea/dnd - contains info about source and destination (both have index)
    // UI check + Reducer check
    const { source, destination } = result;

    // if a user drags a task and drops it outside - return
    if (!destination) {
      return;
    }

    // do not reorder if sorting is active (confusing UX)
    if (sortMode !== "none") {
      return;
    }

    dispatch(
      reorder({
        sourceIndex: source.index,
        destIndex: destination.index,
      })
    );
  }

  //UI Rendering
  return (
    <div className="tasklist-container">
      <section className="card tasklist-form-section">
        <h2 className="tasklist-title">To Do List</h2>

        {/*Tasklist form*/}
        <form className="tasklist-form" onSubmit={addTask}>
          <input
            className="tasklist-input"
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
            placeholder="Write a task..."
          />
          {/*Priority selector*/}
          <select
            className="tasklist-select-priority"
            value={taskPriority}
            onChange={(event) => setTaskPriority(Number(event.target.value))}
          >
            <option value={0}>None</option>
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
          <button className="tasklist-button" type="submit">
            Add
          </button>
        </form>
      </section>

      {/*Render HeaderActions between Tasklist form and Tasklist items*/}
      <HeaderActions
        totalCount={visibleTaskArray.length}
        selectedCount={visibleIdsArray.length}
        onCompleteSelected={completeSelected}
        onDeleteSelected={deleteSelected}
        onToggleSelectAll={toggleCheckAll}
        isAllChecked={isAllChecked}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        filterMode={filterMode}
        onFilterModeChange={setFilterMode}
      />

      <section className="card">
        {/*If taskArray length is zero, show EmptyState card, else show the TaskItem*/}
        {taskArray.length === 0 ? (
          <EmptyState />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="task-list"
              isDropDisabled={sortMode !== "none"}
            >
              {(provided) => (
                <ul
                  className="tasklist-items-container"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {/*isChecked used to just update the UI checkbox*/}
                  {visibleTaskArray.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                      isDragDisabled={sortMode !== "none"}
                    >
                      {/*Some props are for DnD feature*/}
                      {(provided) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          isChecked={isChecked(task.id)}
                          onDelete={deleteTask}
                          onUpdateChecked={toggleChecked}
                          onToggleCompleted={toggleCompleted}
                          onTaskTitleEdit={taskTitleEdit}
                          dragHandleProps={
                            sortMode === "none" ? provided.dragHandleProps : {}
                          }
                          dragProps={provided.draggableProps}
                          ref={provided.innerRef}
                          ariaDisabled={sortMode !== "none"}
                        />
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </section>

      {/*Footer that shows tasks number*/}
      <footer className="tasklist-footer">
        <p>
          {visibleTaskArray.length}{" "}
          {visibleTaskArray.length === 1 ? "task" : "tasks"} total
        </p>
      </footer>
    </div>
  );
}
