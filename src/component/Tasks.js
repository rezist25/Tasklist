import React, { useState, useEffect } from "react";
import { tasks } from "../data/TestData";
import TaskList from "./TaskList";
import AddTaskModal from "./AddTaskModal";
import { motion } from "framer-motion";
import "../style/Tasks.css";

export default function Tasks() {
  const [taskList, setTaskList] = useState([]);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const storedTasks = localStorage.getItem("taskList");
    if (storedTasks) {
      setTaskList(JSON.parse(storedTasks));
    } else {
      setTaskList(tasks);
    }
  }, []);

  useEffect(() => {
    if (taskList.length > 0) {
      localStorage.setItem("taskList", JSON.stringify(taskList));
    }
  }, [taskList]);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const progress =
    taskList.length === 0
      ? 0
      : Math.round(
          (taskList.filter((t) => t.completed).length / taskList.length) * 100
        );

  const toggleCompletion = (task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
      progress: !task.completed ? 100 : 0,
    };
    const updatedList = taskList.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    setTaskList(updatedList);
  };

  const deleteTask = (taskId) => {
    const updatedList = taskList.filter((t) => t.id !== taskId);
    setTaskList(updatedList);
  };

  const updateTask = (updatedTask) => {
    const updatedList = taskList.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    setTaskList(updatedList);
  };

  const handleAddTaskClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddTask = (newTask) => {
    const updatedList = [...taskList, newTask];
    setTaskList(updatedList);
  };

  // Dynamic container class for mobile
  const getContainerClass = () => {
    return "container";
  };

  // Dynamic button class for hover state
  const getButtonClass = () => {
    return buttonHovered ? "button buttonHover" : "button";
  };

  return (
    <motion.div
      className={getContainerClass()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="header">TaskList</header>

      <button
        className={getButtonClass()}
        onClick={handleAddTaskClick}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
      >
        Add Task
      </button>

      {isModalOpen && (
        <AddTaskModal onClose={handleCloseModal} onAddTask={handleAddTask} />
      )}

      <div className="progressBarContainer" aria-label="Progress bar">
        <motion.div
          className={`progressBarFill ${progress === 100 ? "complete" : ""}`}
          style={{ width: `${progress}%` }}
          layout
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      <p className="progressText">
        Progress: {progress}% ({taskList.filter((t) => t.completed).length} of{" "}
        {taskList.length} tasks completed)
      </p>

      <TaskList
        list={taskList}
        onToggle={toggleCompletion}
        onDelete={deleteTask}
        onUpdate={updateTask}
      />
    </motion.div>
  );
}
