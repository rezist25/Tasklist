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
  backgroundColor: "#38a169",
  color: "white",
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#e53e3e",
  color: "white",
};

export default function ProgressUpdateModal({ initialProgress, onClose, onSave }) {
  const [progress, setProgress] = useState(initialProgress || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (progress < 0 || progress > 100 || isNaN(progress)) {
      alert("Please enter a valid number between 0 and 100.");
      return;
    }
    onSave(progress);
    onClose();
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose} aria-modal="true" role="dialog">
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2>Update Progress</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="progress-input" style={labelStyle}>Progress %</label>
            <input
              id="progress-input"
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              style={inputStyle}
              required
            />
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
