import React, { useState } from "react";

export default function SessionEdit({ onBack }) {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    energy: "",
    status: "",
    cost: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Changes saved!");
  };

  // ✅ Reusable input style
  const inputStyle = {
    width: "286px",
    height: "56px",
    border: "1px solid #9ca3af", // gray-400
    borderRadius: "4px",
    padding: "0 12px",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "14px",
    color: "#4b5563", // gray-600
    marginBottom: "4px",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      {/* Title */}
      <div style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "24px", fontWeight: 600, lineHeight: "100%" }}>
          Edit Session
        </h3>
      </div>

      {/* Divider */}
      <hr style={{ border: "1px solid #d1d5db" }} />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          flex: 1,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "32px", // spacing between blocks
          overflowY: "auto",
        }}
      >
        {/* Start & End Time */}
        <div style={{ display: "flex", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Start Time</label>
            <input
              type="text"
              name="startTime"
              placeholder="Enter start time"
              value={formData.startTime}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>End Time</label>
            <input
              type="text"
              name="endTime"
              placeholder="Enter end time"
              value={formData.endTime}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Energy */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={labelStyle}>Energy</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="number"
              name="energy"
              placeholder="Enter energy"
              value={formData.energy}
              onChange={handleChange}
              style={inputStyle}
            />
            <span style={{ marginLeft: "12px", fontSize: "14px", color: "#4b5563" }}>
              kW/h
            </span>
          </div>
        </div>

        {/* Status & Cost */}
        <div style={{ display: "flex", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Status</label>
            <input
              type="text"
              name="status"
              placeholder="Enter status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Cost</label>
            <input
              type="number"
              name="cost"
              placeholder="Enter cost"
              value={formData.cost}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
      </form>

      {/* Divider */}
      <hr style={{ border: "1px solid #d1d5db" }} />

      {/* Bottom Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "8px 24px",
            borderRadius: "9999px",
            border: "1px solid black",
            backgroundColor: "white",
            color: "black",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          style={{
            padding: "8px 24px",
            borderRadius: "9999px",
            backgroundColor: "black",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
