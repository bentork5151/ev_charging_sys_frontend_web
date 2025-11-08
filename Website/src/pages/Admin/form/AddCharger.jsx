import React, { useState } from "react";

export default function AddChargerForm({ onClose }) {   // ✅ accept onClose prop
  const [form, setForm] = useState({
    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Charger Added Successfully:\n" + JSON.stringify(form, null, 2));
    onClose(); // ✅ close form after saving
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Charger</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Station Name</label>
            <input
              type="text"
              name="stationName"
              value={form.stationName}
              onChange={handleChange}
              placeholder="Bentork Station, Nanded City"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>OCPP ID</label>
            <input
              type="text"
              name="ocppId"
              value={form.ocppId}
              onChange={handleChange}
              placeholder="12345678"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Connector Type</label>
            <input
              type="text"
              name="connectorType"
              value={form.connectorType}
              onChange={handleChange}
              placeholder="Type2"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Charging Type</label>
            <div style={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="chargingType"
                  value="AC"
                  checked={form.chargingType === "AC"}
                  onChange={handleChange}
                />{" "}
                AC Charging
              </label>
              <label>
                <input
                  type="radio"
                  name="chargingType"
                  value="DC"
                  checked={form.chargingType === "DC"}
                  onChange={handleChange}
                />{" "}
                DC Fast Charging
              </label>
            </div>
          </div>
        </div>

        <div style={styles.row}>
          <div style={{ ...styles.field, flex: 1 }}>
            <label style={styles.label}>Rate</label>
            <div style={styles.sliderContainer}>
              <span>₹25</span>
              <input
                type="range"
                name="rate"
                min="25"
                max="500"
                value={form.rate}
                onChange={handleChange}
                style={styles.slider}
              />
              <span>₹{form.rate}</span>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Charge Mode</label>
            <select
              name="chargeMode"
              value={form.chargeMode}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select Mode</option>
              <option value="Standard">Standard</option>
              <option value="Fast">Fast</option>
              <option value="Ultra Fast">Ultra Fast</option>
            </select>
          </div>
        </div>

        <div style={styles.buttons}>
          <button type="button" style={styles.dismiss} onClick={onClose}> {/* ✅ close form on dismiss */}
            Dismiss
          </button>
          <button type="submit" style={styles.save}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    maxWidth: "800px",
    margin: "2rem auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  row: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  label: {
    fontSize: "0.9rem",
    color: "#333",
    marginBottom: "5px",
  },
  input: {
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px",
    fontSize: "1rem",
  },
  select: {
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  sliderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  slider: {
    flex: 1,
    cursor: "pointer",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "1rem",
  },
  dismiss: {
    padding: "10px 20px",
    borderRadius: "8px",
    background: "#ddd",
    border: "none",
    cursor: "pointer",
  },
  save: {
    padding: "10px 20px",
    borderRadius: "8px",
    background: "#000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
