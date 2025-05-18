import React, { useState, useEffect } from "react";
import { tasks } from "../data/TestData";
import TaskList from "./TaskList";
import AddTaskModal from "./AddTaskModal";
import { motion } from "framer-motion";

const containerStyle = {
  width: "100%",
  height: "auto",
  padding: 20,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: "#f5f7fa",
  borderRadius: 0,
  boxShadow: "none",
  boxSizing: "border-box",
  overflowY: "auto",
};

const headerStyle = {
  fontSize: 28,
  marginBottom: 20,
  color: "#1a202c",
  fontWeight: "700",
  textAlign: "center",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: 16,
  backgroundColor: "#3182ce",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "600",
  transition: "background-color 0.3s ease",
  marginBottom: 20,
};

const buttonHoverStyle = {
  backgroundColor: "#2b6cb0",
};

const progressBarContainer = {
  height: 20,
  backgroundColor: "#e2e8f0",
  borderRadius: 10,
  overflow: "hidden",
  marginBottom: 20,
};

const progressBar = (progress) => ({
  height: "100%",
  width: `${progress}%`,
  backgroundColor: progress === 100 ? "#38a169" : "#3182ce",
  transition: "width 0.8s ease-in-out",
});

export default function Tasks() {
  const [taskList, setTaskList] = useState([]);

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

  const [buttonHovered, setButtonHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      progress: !task.completed ? 100 : 0
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

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header style={headerStyle}>TaskList</header>

      <button
        style={{ ...buttonStyle, ...(buttonHovered ? buttonHoverStyle : {}) }}
        onClick={handleAddTaskClick}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
      >
        Add Task
      </button>

      {isModalOpen && (
        <AddTaskModal onClose={handleCloseModal} onAddTask={handleAddTask} />
      )}

      <div style={progressBarContainer} aria-label="Progress bar">
        <motion.div
          style={progressBar(progress)}
          layout
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      <p style={{ marginBottom: 20, color: "#4a5568", fontWeight: "600" }}>
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
