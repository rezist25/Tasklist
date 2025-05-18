import React, { useState } from "react";
import Task from "./Task";
import EditTaskModal from "./EditTaskModal";

const gridContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 20,
  padding: 0,
  margin: 0,
};

export default function TaskList({ list, onToggle, onDelete, onUpdate }) {
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleSaveTask = (updatedTask) => {
    onUpdate(updatedTask);
    setSelectedTask(null);
  };

  return (
    <>
      <div style={gridContainerStyle}>
        {list.map((mappedTask) => {
          return (
            <div
              key={mappedTask.id}
              onClick={() => handleTaskClick(mappedTask)}
              style={{ cursor: "pointer" }}
            >
              <Task
                task={mappedTask}
                onToggle={() => onToggle(mappedTask)}
                onDelete={() => onDelete(mappedTask.id)}
                onUpdate={(updatedTask) => onUpdate(updatedTask)}
              />
            </div>
          );
        })}
      </div>
      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}
    </>
  );
}
