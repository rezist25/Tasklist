import React, { useState } from "react";
import Task from "./Task";
import EditTaskModal from "./EditTaskModal";

const gridContainerStyle = {
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

const taskItemStyle = {
  flex: "1 1 calc(30% - 10px)", // 3 tasks per row with gap
  maxWidth: "calc(30% - 10px)",
  boxSizing: "border-box",
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
{list.map((mappedTask, index) => {
  return (
    <div
      key={mappedTask.id}
      style={{ ...taskItemStyle, cursor: "default" }}
    >
      <Task
        task={mappedTask}
        isFirst={index === 0}
        onToggle={() => onToggle(mappedTask)}
        onDelete={() => onDelete(mappedTask.id)}
        onUpdate={(updatedTask) => onUpdate(updatedTask)}
        onEdit={() => handleTaskClick(mappedTask)}
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
