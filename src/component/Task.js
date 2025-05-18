import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import ProgressUpdateModal from "./ProgressUpdateModal";
import "../style/Task.css";

const priorityClass = {
  High: "priorityHigh",
  Medium: "priorityMedium",
  Low: "priorityLow",
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

  // Handle done/Not Completed button click
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
      // Marking as Not Completed: reset progress to 0 and mark incomplete
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
        className={`outerCard ${task.completed ? "completed" : ""}`}
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.8 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        layout
      >
        <div className="innerCard mainInfo">
          <div className="header">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDoneClick();
              }}
              className="doneButton"
              aria-label={
                task.completed
                  ? `Mark task ${task.title} as Not Completed`
                  : `Mark task ${task.title} as completed`
              }
            >
              {task.completed ? "Mark as Not Completed" : "Mark as Completed"}
            </button>
            <span className="title">
              {task.id} - {task.title}
            </span>
            <span className={priorityClass[task.priority] || ""}>
              {task.priority}
            </span>
            <button
              onClick={() => onDelete(task.id)}
              className="deleteButton"
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
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 8,
              fontSize: 14,
              color: "black",
            }}
          >
            <div>
              <strong>Start Date:</strong> {task.startDate || "N/A"}
            </div>
            <div>
              <strong>End Date:</strong> {task.approxEndDate || "N/A"}
            </div>
            <div>
              <strong>Due Date:</strong> {task.date || "N/A"}
            </div>
          </div>
        </div>

        <div className="innerCard" ref={sliderRef} onMouseDown={handleMouseDown}>
          <div className="sliderContainer">
            <span className="completeLabel"> %Completed</span>
            <div className="sliderTrack">
              <div
                className="sliderFill"
                style={{ width: `${progress}%` }}
              />
              <div
                className="sliderThumb"
                style={{ left: `${progress}%` }}
              />
            </div>
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round(progress)}
              onChange={handleNumberInputChange}
              className="inputNumber"
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
