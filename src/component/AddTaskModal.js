import React, { useState } from "react";

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "white",
  borderRadius: 8,
  padding: 20,
  width: "90%",
  maxWidth: "90vw",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
};

const formGroupStyle = {
  marginBottom: 15,
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: 8,
  fontWeight: "600",
  color: "#2d3748",
};

const inputStyle = {
  padding: 8,
  fontSize: 14,
  borderRadius: 4,
  border: "1px solid #ccc",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 60,
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const buttonStyle = {
  padding: "8px 16px",
  fontSize: 14,
  borderRadius: 4,
  border: "none",
  cursor: "pointer",
};

const addButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#38a169",
  color: "white",
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#e53e3e",
  color: "white",
};

export default function AddTaskModal({ onClose, onAddTask }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [approxEndDate, setApproxEndDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }
    const newTask = {
      title: title.trim(),
      details: details.trim(),
      startDate,
      approxEndDate,
      priority,
      completed: false,
      progress: 0,
      date: approxEndDate, // Assuming due date is approx end date
    };
    onAddTask(newTask);
    onClose();
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose} aria-modal="true" role="dialog">
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="task-title" style={labelStyle}>Task Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              style={inputStyle}
              placeholder="Enter task title"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="task-details" style={labelStyle}>Task Details</label>
            <textarea
              id="task-details"
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
              }}
              style={textareaStyle}
              placeholder="Enter task details"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="start-date" style={labelStyle}>Start Date</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              style={inputStyle}
              placeholder="Select start date"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="approx-end-date" style={labelStyle}>Approximate End Date</label>
            <input
              id="approx-end-date"
              type="date"
              value={approxEndDate}
              onChange={(e) => {
                setApproxEndDate(e.target.value);
              }}
              style={inputStyle}
              placeholder="Select approximate end date"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="priority" style={labelStyle}>Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
              }}
              style={inputStyle}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button type="submit" style={addButtonStyle}>Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
