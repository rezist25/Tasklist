import React, { useState, useEffect } from "react";

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
  width: 400,
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

const saveButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#3182ce",
  color: "white",
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#e53e3e",
  color: "white",
};

export default function EditTaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task.title || "");
  const [details, setDetails] = useState(task.details || "");
  const [startDate, setStartDate] = useState(task.startDate || "");
  const [approxEndDate, setApproxEndDate] = useState(task.approxEndDate || "");
  const [priority, setPriority] = useState(task.priority || "Medium");

  useEffect(() => {
    setTitle(task.title || "");
    setDetails(task.details || "");
    setStartDate(task.startDate || "");
    setApproxEndDate(task.approxEndDate || "");
    setPriority(task.priority || "Medium");
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }
    const updatedTask = {
      ...task,
      title: title.trim(),
      details: details.trim(),
      startDate, // startDate is not editable but included for completeness
      approxEndDate,
      priority,
      date: approxEndDate, // Assuming due date is approx end date
    };
    onSave(updatedTask);
    onClose();
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose} aria-modal="true" role="dialog">
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="edit-task-title" style={labelStyle}>Task Title</label>
            <input
              id="edit-task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              placeholder="Enter task title"
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="edit-task-details" style={labelStyle}>Task Details</label>
            <textarea
              id="edit-task-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              style={textareaStyle}
              placeholder="Enter task details"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="edit-start-date" style={labelStyle}>Start Date</label>
            <input
              id="edit-start-date"
              type="date"
              value={startDate}
              style={inputStyle}
              disabled
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="edit-approx-end-date" style={labelStyle}>Approximate End Date</label>
            <input
              id="edit-approx-end-date"
              type="date"
              value={approxEndDate}
              onChange={(e) => setApproxEndDate(e.target.value)}
              style={inputStyle}
              placeholder="Select approximate end date"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="edit-priority" style={labelStyle}>Priority</label>
            <select
              id="edit-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={inputStyle}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button type="submit" style={saveButtonStyle}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
