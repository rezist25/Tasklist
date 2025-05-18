


import React, { useState, useEffect } from "react";
import Task from "./Task";
import EditTaskModal from "./EditTaskModal";

const baseGridContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  padding: 10,
  margin: 0,
  width: "100%",
  boxSizing: "border-box",
  justifyContent: "center",
  alignItems: "flex-start",
  minHeight: "100vh",
};

const baseTaskItemStyle = {
  flex: "1 1 calc(30% - 10px)", // 3 tasks per row with gap
  maxWidth: "calc(30% - 10px)",
  boxSizing: "border-box",
};

export default function TaskList({ list, onToggle, onDelete, onUpdate }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic task item style for mobile
  const taskItemStyle =
    windowWidth <= 768
      ? windowWidth > 480
        ? { flex: "1 1 calc(45% - 10px)", maxWidth: "calc(45% - 10px)", boxSizing: "border-box" }
        : { flex: "1 1 100%", maxWidth: "100%", boxSizing: "border-box" }
      : baseTaskItemStyle;

  return (
    <>
      <div style={baseGridContainerStyle}>
        {list.map((mappedTask, index) => {
          return (
            <div
              key={`${mappedTask.id}-${mappedTask.progress}`} // include progress in key to force re-render
              style={{ ...taskItemStyle, cursor: "default" }}
            >
              <Task
                task={mappedTask}
                isFirst={index === 0}
                onToggle={() => onToggle(mappedTask)}
                onDelete={() => onDelete(mappedTask.id)}
                onUpdate={(updatedTask) => onUpdate(updatedTask)}
                onEdit={() => setSelectedTask(mappedTask)}
              />
            </div>
          );
        })}
      </div>
      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={(updatedTask) => {
            onUpdate(updatedTask);
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
}
