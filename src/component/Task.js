import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";

const priorityColors = {
  High: "#e53e3e",
  Medium: "#dd6b20",
  Low: "#38a169",
};

const outerCardStyle = (completed) => ({
  marginBottom: 10,
  padding: 10,
  border: "1px solid #cbd5e0",
  borderRadius: 8,
  backgroundColor: completed ? "#add8e6" : "black", // light blue when completed, black otherwise
  boxShadow: completed ? "0 0 10px #38a169aa" : "none",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  color: completed ? "black" : "white", // text color for contrast
});

const innerCardStyle = {
  border: "1px solid #cbd5e0",
  borderRadius: 6,
  padding: 10,
  backgroundColor: "white",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  color: "black",
};

const mainInfoStyle = {
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: 8,
};

const doneButtonStyle = {
  marginRight: 10,
  padding: "6px 12px",
  backgroundColor: "#38a169",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "600",
  transition: "background-color 0.3s ease",
};

const titleStyle = {
  flexGrow: 1,
  fontWeight: "bold",
  fontSize: 16,
};

const priorityStyle = (priority) => ({
  padding: "2px 8px",
  borderRadius: 4,
  backgroundColor: priorityColors[priority] || "#a0aec0",
  color: "white",
  fontSize: 12,
  fontWeight: "bold",
  marginRight: 10,
  userSelect: "none",
});

const deleteButtonStyle = {
  backgroundColor: "#e53e3e",
  color: "white",
  border: "none",
  borderRadius: 4,
  padding: "4px 8px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "background-color 0.3s ease",
};

const labelStyle = {
  marginBottom: 8,
  fontSize: 14,
  userSelect: "none",
};

const inputDateStyle = {
  padding: 6,
  fontSize: 14,
  borderRadius: 6,
  border: "1px solid #cbd5e0",
  outline: "none",
  transition: "border-color 0.3s ease",
};

const sliderContainerStyle = {
  position: "relative",
  width: "100%",
  height: 24,
  userSelect: "none",
  display: "flex",
  alignItems: "center",
  gap: 10,
  cursor: "default",
  color: "black",
};

const sliderTrackStyle = {
  position: "relative",
  flexGrow: 1,
  height: 6,
  backgroundColor: "#e2e8f0",
  borderRadius: 3,
};

const sliderFillStyle = (progress) => ({
  position: "absolute",
  top: 0,
  left: 0,
  height: 6,
  width: `${progress}%`,
  backgroundColor: "#38a169",
  borderRadius: 3,
  transition: "width 0.3s ease",
});

const sliderThumbStyle = (progress) => ({
  position: "absolute",
  top: "50%",
  left: `${progress}%`,
  width: 20,
  height: 20,
  backgroundColor: "#38a169",
  borderRadius: "50%",
  transform: "translate(-50%, -50%)",
  cursor: "pointer",
  boxShadow: "0 0 5px rgba(56, 161, 105, 0.7)",
  transition: "left 0.1s ease",
});

const inputNumberStyle = {
  width: 50,
  padding: 4,
  fontSize: 14,
  borderRadius: 6,
  border: "1px solid #cbd5e0",
  outline: "none",
  textAlign: "center",
  color: "black",
};

const completeLabelStyle = {
  fontSize: 14,
  fontWeight: "600",
  userSelect: "none",
  marginRight: 8,
  minWidth: 70,
  textAlign: "right",
};

export default function Task({ task, onToggle, onDelete, onUpdate, onClick }) {
  const [progress, setProgress] = React.useState(task.progress || 0);
  const sliderRef = React.useRef(null);
  const draggingRef = React.useRef(false);

  React.useEffect(() => {
    if (!draggingRef.current) {
      setProgress(task.progress || 0);
    }
  }, [task.progress]);

  const debouncedUpdate = React.useCallback(
    debounce((updatedTask) => {
      onUpdate(updatedTask);
    }, 300),
    [onUpdate]
  );

  const updateProgress = (newProgress) => {
    newProgress = Math.min(100, Math.max(0, newProgress));
    setProgress(newProgress);
    const updatedTask = { ...task, progress: Math.round(newProgress) };
    if (newProgress === 100) {
      updatedTask.completed = true;
    } else if (task.completed) {
      updatedTask.completed = false;
    }
    debouncedUpdate(updatedTask);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    draggingRef.current = true;
    updateProgressFromPosition(e.clientX);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    updateProgressFromPosition(e.clientX);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    draggingRef.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const updateProgressFromPosition = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let newProgress = ((clientX - rect.left) / rect.width) * 100;
    updateProgress(newProgress);
  };

  const handleNumberInputChange = (e) => {
    let value = e.target.value;
    if (value === "") {
      setProgress(0);
      return;
    }
    const intValue = parseInt(value, 10);
    if (!isNaN(intValue)) {
      updateProgress(intValue);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    onUpdate({ ...task, date: newDate });
  };

  return (
    <motion.li
      style={outerCardStyle(task.completed)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <div style={{ ...innerCardStyle, ...mainInfoStyle }} onClick={onClick}>
        <div style={headerStyle}>
          <button
            onClick={() => onToggle(task)}
            style={doneButtonStyle}
            aria-label={
              task.completed
                ? `Mark task ${task.title} as undone`
                : `Mark task ${task.title} as done`
            }
          >
            {task.completed ? "Undo" : "Done"}
          </button>
          <span style={titleStyle}>
            {task.id} - {task.title}
          </span>
          <span style={priorityStyle(task.priority)}>{task.priority}</span>
          <button
            onClick={() => onDelete(task.id)}
            style={deleteButtonStyle}
            aria-label={`Delete task ${task.title}`}
          >
            Delete
          </button>
        </div>

        <div>
          <label style={labelStyle}>
            Due Date:{" "}
            <input
              type="date"
              value={task.date || ""}
              onChange={handleDateChange}
              style={inputDateStyle}
            />
          </label>
        </div>
      </div>

      <div
        style={innerCardStyle}
        ref={sliderRef}
        onMouseDown={handleMouseDown}
      >
        <div style={sliderContainerStyle}>
          <span style={completeLabelStyle}>Complete %</span>
          <div style={sliderTrackStyle}>
            <div style={sliderFillStyle(progress)} />
            <div style={sliderThumbStyle(progress)} />
          </div>
          <input
            type="number"
            min="0"
            max="100"
            value={Math.round(progress)}
            onChange={handleNumberInputChange}
            style={inputNumberStyle}
            aria-label="Progress percentage input"
          />
        </div>
      </div>
    </motion.li>
  );
}
