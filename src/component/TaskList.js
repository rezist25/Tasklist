


import React, { useState, useEffect } from "react";
import Task from "./Task";
import EditTaskModal from "./EditTaskModal";
import "../style/TaskList.css";

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

  // Determine task item class based on window width
  const getTaskItemClass = () => {
    if (windowWidth <= 768) {
      if (windowWidth > 480) {
        return "taskItem medium";
      } else {
        return "taskItem small";
      }
    }
    return "taskItem";
  };

  return (
    <>
      <div className="gridContainer">
        {list.map((mappedTask, index) => {
          return (
            <div
              key={`${mappedTask.id}-${mappedTask.progress}`} // include progress in key to force re-render
              className={getTaskItemClass()}
              style={{ cursor: "default" }}
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
