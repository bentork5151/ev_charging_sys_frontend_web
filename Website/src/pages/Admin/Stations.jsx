import React, { useState, useEffect } from "react";
import DashboardCard from "../../components/card/stationcard";


import AddStation from "../Admin/form/stationform";

import totalIcon from "../../assets/icons/stationicon/Vector.svg";
import activeIcon from "../../assets/icons/stationicon/green.svg";
import uptimeIcon from "../../assets/icons/stationicon/yellow.svg";
import errorIcon from "../../assets/icons/stationicon/red.svg";
import plus from "../../assets/icons/stationicon/plus.svg";
import sortIcon from "../../assets/icons/stationicon/upndown.svg";
import editIcon from "../../assets/icons/stationicon/edit.svg";
import deleteIcon from "../../assets/icons/stationicon/delete.svg";

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStations = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/api/stations/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch stations");
      const data = await response.json();
      setStations(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load station data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/stations/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete station");
      fetchStations(); // refresh table
    } catch (err) {
      alert("Error deleting station: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Roboto, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px", fontFamily: "Lexend, sans-serif" }}>
          Station Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "174px",
            height: "48px",
            borderRadius: "18px",
            padding: "12px 18px",
            backgroundColor: "#000",
            color: "#fff",
            fontFamily: "Roboto, sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          <img src={plus} alt="icon" style={{ width: "14px", height: "14px" }} />
          Create Station
        </button>
      </div>

      {/* Add Station Form */}
      {showForm && <AddStation onBack={() => setShowForm(false)} onStationAdded={fetchStations} />}

      {!showForm && (
        <>
          {/* Dashboard Cards */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "20px", maxWidth: "1106px", width: "100%" }}>
              <DashboardCard title="Total Stations" value={stations.length} subtitle="" icon={totalIcon} noShadow />
              <DashboardCard
                title="Active Stations"
                value={stations.filter(s => s.status === "Active").length}
                subtitle=""
                icon={activeIcon}
                noShadow
              />
              <DashboardCard title="Average Uptime" value="76%" subtitle="-1.8% from last week" icon={uptimeIcon} noShadow />
              <DashboardCard title="Errors Today" value="3" subtitle="+1 from yesterday" icon={errorIcon} noShadow />
            </div>
          </div>

          {/* System Health Section */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "100%",
                maxWidth: "1106px",
                height: "394px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                border: "0.2px solid #ddd",
                borderRadius: "14px",
                padding: "15px 28px",
                backgroundColor: "#fff",
                fontFamily: "Roboto, sans-serif",
                marginTop: "20px",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "5px" }}>System Health Overview</h3>
                <p style={{ fontSize: "14px", color: "#555", lineHeight: "160%" }}>
                  Real-time monitoring of station performance
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  fontSize: "14px",
                }}
              >
                [Chart / Graph will appear here]
              </div>
            </div>
          </div>

          {/* Stations Table */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
            <div style={{ width: "1140px", minHeight: "324px", border: "0.2px solid #ddd", borderRadius: "14px", padding: "18px", backgroundColor: "#FFFFFF", fontFamily: "Lexend, sans-serif" }}>
              <h3 style={{ fontWeight: "700", marginBottom: "15px", fontSize: "18px", color: "#1A1A1A" }}>Stations</h3>

              {loading ? (
                <p>Loading stations...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px", fontFamily: "Roboto, sans-serif", fontSize: "14px" }}>
                  <thead>
                    <tr>
                      {["Name", "Location ID", "Status", "Created at", "Direction Link", "Action"].map((header, index) => (
                        <th key={index} style={{ padding: "10px 12px", fontWeight: "600", textAlign: index === 5 ? "center" : "left", color: "#333333", fontSize: "14px" }}>
                          {header !== "Action" ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              {header}
                              <img src={sortIcon} alt="Sort" style={{ width: "12px", height: "12px", cursor: "pointer" }} />
                            </div>
                          ) : header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stations.map((station) => (
                      <tr key={station.id} style={{ backgroundColor: "#fff", borderRadius: "12px" }}>
                        <td style={{ padding: "12px" }}>{station.name}</td>
                        <td style={{ padding: "12px" }}>{station.locationName}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "72px",
                            height: "26px",
                            borderRadius: "15px",
                            fontWeight: 600,
                            fontSize: "12px",
                            color: station.status === "Busy" ? "#D0A000" : "#00A000",
                            backgroundColor: station.status === "Busy" ? "#FFF3CC" : "#DFFFE0",
                          }}>{station.status}</span>
                        </td>
                        <td style={{ padding: "12px" }}>{new Date(station.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "12px" }}>
                          <a href={station.directionLink} target="_blank" rel="noreferrer">View</a>
                        </td>
                        <td style={{ display: "flex", justifyContent: "center", gap: "12px", padding: "12px", alignItems: "center" }}>
                          <img src={editIcon} alt="Edit" style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                          <img src={deleteIcon} alt="Delete" style={{ width: "16px", height: "16px", cursor: "pointer" }} onClick={() => handleDelete(station.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Logs Table (Static) */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
            <div style={{ width: "1140px", minHeight: "324px", border: "0.2px solid #ddd", borderRadius: "14px", padding: "18px", backgroundColor: "#FFFFFF", fontFamily: "Roboto, sans-serif" }}>
              <h3 style={{ fontWeight: "700", marginBottom: "15px", fontSize: "18px", color: "#1A1A1A" }}>Logs</h3>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px", fontSize: "14px" }}>
                <thead>
                  <tr>
                                        {["Timestamp", "Action", "User", "Details", "Type"].map((header, index) => (
                      <th key={index} style={{ padding: "10px 12px", fontWeight: "600", textAlign: "left", color: "#333333", fontSize: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {header}
                          <img src={sortIcon} alt="Sort" style={{ width: "12px", height: "12px", cursor: "pointer" }} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: "09/10/2025 09:00", action: "Station Created", user: "Admin", details: "Added Main Street Station", type: "Info" },
                    { time: "09/10/2025 10:15", action: "Station Error", user: "System", details: "Power supply failure at Downtown Station", type: "Error" },
                    { time: "09/10/2025 11:30", action: "Station Updated", user: "Admin", details: "Updated location of Central Park Station", type: "Info" },
                  ].map((log, idx) => (
                    <tr key={idx} style={{ backgroundColor: "#fff", borderRadius: "12px" }}>
                      <td style={{ padding: "12px" }}>{log.time}</td>
                      <td style={{ padding: "12px" }}>{log.action}</td>
                      <td style={{ padding: "12px" }}>{log.user}</td>
                      <td style={{ padding: "12px" }}>{log.details}</td>
                      <td style={{ padding: "12px" }}>{log.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;

