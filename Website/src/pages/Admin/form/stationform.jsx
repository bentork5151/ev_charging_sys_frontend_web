import React, { useState } from "react";
import Bottomnav from "../../../components/admin/Bottomnav";
import stationFormImage from "../../../assets/images/station_form_image.png";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons for Vite
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const ACCENT = "#7c3aed";

function AddStation({ onBack, onStationAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    locationName: "",
    locationId: 1, // valid location ID
    status: "Active",
    // default coordinates for map marker
    latitude: 12.9716,
    longitude: 77.5946,
    directionLink: "https://maps.google.com/?q=12.9716,77.5946",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: formData.name,
        locationName: formData.locationName,
        locationId: formData.locationId,
        status: formData.status,
        directionLink: formData.directionLink,
      };

      const response = await fetch("http://localhost:8080/api/stations/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to add station");
      }

      alert("Station added successfully!");
      onStationAdded();
      onBack();
    } catch (err) {
      console.error("Error adding station:", err);
      alert("Error adding station: " + err.message);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 56px" }}>
        <h2 style={{ fontWeight: 600, fontSize: "24px", margin: "0 0 5px", color: "#1E1E1E" }}>
          Add Station
        </h2>
        <p style={{ fontSize: "12px", margin: "0 0 20px", color: "#555" }}>
          Create a new charging station location
        </p>
        <hr style={{ marginBottom: "20px", borderColor: "#e0e0e0" }} />

        <div style={{ display: "flex", gap: "40px", maxWidth: "1100px" }}>
          {/* Left Form */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: "16px", marginBottom: "15px" }}>Basic Details</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <FloatingInput label="Station Name" name="name" value={formData.name} onChange={handleChange} />
              <FloatingInput label="Location Name" name="locationName" value={formData.locationName} onChange={handleChange} />
              <FloatingInput label="Direction Link" name="directionLink" value={formData.directionLink} onChange={handleChange} />
              <FloatingInput
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                type="number"
              />
              <FloatingInput
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>

          {/* Right Map */}
          <div style={{ flex: 1, marginTop: "20px" }}>
            <MapContainer
              center={[formData.latitude, formData.longitude]}
              zoom={13}
              style={{ height: "400px", borderRadius: "10px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[formData.latitude, formData.longitude]}>
                <Popup>
                  {formData.name || "Station Marker"} <br /> {formData.locationName}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <img src={stationFormImage} alt="Station Form Illustration" style={{ maxWidth: "320px" }} />
        </div>
      </div>

      <Bottomnav onBack={onBack} onSubmit={handleSubmit} />
    </div>
  );
}

function FloatingInput({ label, type = "text", name, value, onChange }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <label
        style={{
          position: "absolute",
          left: 12,
          top: focused || value ? -8 : "50%",
          transform: focused || value ? "translateY(0)" : "translateY(-50%)",
          fontSize: focused || value ? 12 : 14,
          color: focused ? ACCENT : "#888",
          background: "#fff",
          padding: "0 4px",
          transition: "all 0.2s ease",
          pointerEvents: "none",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          height: 52,
          padding: "12px 14px",
          fontSize: 15,
          borderRadius: 6,
          border: "1px solid",
          borderColor: focused ? ACCENT : "#ccc",
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          boxShadow: focused ? "0 0 0 2px rgba(124,58,237,0.15)" : "none",
        }}
      />
    </div>
  );
}

export default AddStation;
