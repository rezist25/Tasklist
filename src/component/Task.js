import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import ProgressUpdateModal from "./ProgressUpdateModal";

const priorityColors = {
  High: "#e53e3e",
  Medium: "#dd6b20",
  Low: "#38a169",
};

const outerCardStyle = (completed) => ({
  marginBottom: 20,
  padding: 15,
  border: "1px solid #cbd5e0",
  borderRadius: 12,
  backgroundColor: completed ? "#add8e6" : "black", // light blue when completed, black otherwise
  boxShadow: completed ? "0 0 15px #38a169aa" : "none",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  color: completed ? "black" : "white", // text color for contrast
  maxWidth: "100%",
  boxSizing: "border-box",
  overflowWrap: "break-word",
});

const innerCardStyle = {
  border: "1px solid #cbd5e0",
  borderRadius: 8,
  padding: 15,
  backgroundColor: "white",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  color: "black",
  boxSizing: "border-box",
};

const mainInfoStyle = {
  cursor: "default",
  display: "flex",
  flexDirection: "column",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: 8,
};

const doneButtonStyle = {
  marginRight: "0.625rem", // 10px
  padding: "0.375rem 0.75rem", // 6px 12px
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
  padding: "0.25rem 0.5rem", // 4px 8px
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

export default function Task({ task, onToggle, onDelete, onUpdate, onEdit }) {
  const [progress, setProgress] = React.useState(task.progress || 0);
  const [showProgressModal, setShowProgressModal] = React.useState(false);
  const sliderRef = React.useRef(null);
  const draggingRef = React.useRef(false);

  React.useEffect(() => {
    if (!draggingRef.current) {
      setProgress(task.progress || 0);
    }
  }, [task.progress]);

  // Debounced update to avoid excessive updates
  const debouncedUpdate = React.useCallback(
    debounce((updatedTask) => {
      try {
        onUpdate(updatedTask);
      } catch (error) {
        console.error("Error in onUpdate callback:", error);
      }
    }, 300),
    [onUpdate]
  );

  // Update progress state and notify parent
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

  // Mouse event handlers for slider drag
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

  // Calculate progress based on mouse position
  const updateProgressFromPosition = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let newProgress = ((clientX - rect.left) / rect.width) * 100;
    updateProgress(newProgress);
  };

  // Handle manual number input change
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

  // Handle due date change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    try {
      onUpdate({ ...task, date: newDate });
    } catch (error) {
      console.error("Error in onUpdate callback:", error);
    }
  };

  // Handle done/undo button click
  const handleDoneClick = () => {
    if (!task.completed) {
      // Optimistically update progress to 100%
      setProgress(100);
      try {
        onToggle({ ...task, completed: true, progress: 100 });
      } catch (error) {
        console.error("Error in onToggle callback:", error);
      }
    } else {
      // Marking as undone: reset progress to 0 and mark incomplete
      setProgress(0);
      try {
        onToggle({ ...task, completed: false, progress: 100 });
      } catch (error) {
        console.error("Error in onToggle callback:", error);
      }
    }
  };

  // Handle progress update from modal save
  const handleProgressSave = (newProgress) => {
    setProgress(newProgress);
    try {
      onToggle({ ...task, completed: false, progress: newProgress });
    } catch (error) {
      console.error("Error in onToggle callback:", error);
    }
    setShowProgressModal(false);
  };

  // Close progress update modal
  const handleProgressModalClose = () => {
    setShowProgressModal(false);
  };

  return (
    <>
      <motion.li
        style={outerCardStyle(task.completed)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        layout
      >
<div style={{ ...innerCardStyle, ...mainInfoStyle }}>
          <div style={headerStyle}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDoneClick();
              }}
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                style={{
                  backgroundColor: "#3182ce",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  marginLeft: 8,
                  transition: "background-color 0.3s ease",
                }}
                aria-label={`Edit task ${task.title}`}
              >
                Edit
              </button>
          </div>

          <div style={{ marginBottom: 8, fontSize: 14, color: "black" }}>
            <strong>Details:</strong> {task.details || "No details"}
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 14, color: "black" }}>
            <div><strong>Start Date:</strong> {task.startDate || "N/A"}</div>
            <div><strong>End Date:</strong> {task.approxEndDate || "N/A"}</div>
            <div><strong>Due Date:</strong> {task.date || "N/A"}</div>
          </div>
        </div>

        <div
          style={innerCardStyle}
          ref={sliderRef}
          onMouseDown={handleMouseDown}
        >
          <div style={sliderContainerStyle}>
            <span style={completeLabelStyle}> %Completed</span>
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
      {showProgressModal && (
        <ProgressUpdateModal
          initialProgress={progress}
          onClose={handleProgressModalClose}
          onSave={handleProgressSave}
        />
      )}
    </>
  );
}
