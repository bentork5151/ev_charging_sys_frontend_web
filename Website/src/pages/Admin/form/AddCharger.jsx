import React, { useState } from "react";

export default function AddCharger({ onClose }) {
  const [formData, setFormData] = useState({
    stationId: "",
    ocppId: "",
    connectorType: "",
    chargerType: "",
    rate: "",
    chargeMode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Charger Added Successfully!");
    setOpen(false);
  };
 
  return (
    
    <div style={styles.container}>
         <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "24px",
          width: "100%",
          maxWidth: "650px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          fontFamily: "Lexend, sans-serif",
        }}
      >
      <h2>Add Charger</h2>
      <form style={styles.form} onSubmit={handleSubmit}
      >
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label>Station ID</label>
            <input name="stationId" value={formData.stationId} onChange={handleChange} />
          </div>
          <div style={styles.inputGroup}>
            <label>OCPP ID</label>
            <input name="ocppId" value={formData.ocppId} onChange={handleChange} />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label>Connector Type</label>
            <input name="connectorType" value={formData.connectorType} onChange={handleChange} />
          </div>
          <div style={styles.inputGroup}>
            <label>Charger Type</label>
            <input name="chargerType" value={formData.chargerType} onChange={handleChange} />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label>Rate</label>
            <input name="rate" value={formData.rate} onChange={handleChange} />
          </div>
          <div style={styles.inputGroup}>
            <label>Charge Mode</label>
            <input name="chargeMode" value={formData.chargeMode} onChange={handleChange} />
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button type="button" style={styles.dismissBtn} onClick={onClose}>
            Dismiss
          </button>
          <button type="submit" style={styles.saveBtn} onClick={onClose}>
            Save
          </button>
        </div>
      </form>
    </div>
    </div>
  );

}

const styles = {
  container: {
    border: "1px dashed #999",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "700px",
    margin: "auto",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  row: { display: "flex", gap: "20px" },
  inputGroup: { flex: 1, display: "flex", flexDirection: "column" },
  buttonRow: { display: "flex", justifyContent: "flex-end", gap: "10px" },
  dismissBtn: { backgroundColor: "transparent", border: "none", fontWeight: "bold", cursor: "pointer" },
  saveBtn: { backgroundColor: "black", color: "white", border: "none", padding: "8px 20px", borderRadius: "20px", cursor: "pointer" },
};