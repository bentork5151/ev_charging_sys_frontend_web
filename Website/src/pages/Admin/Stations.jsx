import React, { useState, useEffect } from "react";

import totalIcon from "../../assets/icons/stationicon/Vector.svg";
import activeIcon from "../../assets/icons/stationicon/green.svg";
import uptimeIcon from "../../assets/icons/stationicon/yellow.svg";
import errorIcon from "../../assets/icons/stationicon/red.svg";
import sortIcon from "../../assets/icons/stationicon/upndown.svg";
import editIcon from "../../assets/icons/stationicon/edit.svg";
import deleteIcon from "../../assets/icons/stationicon/delete.svg";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSessions = async () => {
    const token = localStorage.getItem("userToken"); // same as Dashboard's token
    try {
      const response = await fetch("http://localhost:8080/api/sessions/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch sessions");
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Summary cards
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s => s.status === "Active").length;
  const errorSessions = sessions.filter(s => s.status === "Error").length;
  const averageUptime = sessions.length
    ? Math.round(
        sessions.reduce((sum, s) => sum.uptime ? sum.uptime + s.uptime : sum, 0) / sessions.length
      )
    : 0;

  return (
    <div style={{ padding: "20px", fontFamily: "Roboto, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px", fontFamily: "Lexend, sans-serif" }}>
          Sessions
        </h2>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", maxWidth: "1106px", width: "100%" }}>
          <Card title="Total Sessions" value={totalSessions} icon={totalIcon} />
          <Card title="Active Sessions" value={activeSessions} icon={activeIcon} />
          <Card title="Average Uptime" value={`${averageUptime}%`} icon={uptimeIcon} />
          <Card title="Error Today" value={errorSessions} icon={errorIcon} />
        </div>
      </div>

      {/* Sessions Table */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <div style={{ width: "1140px", minHeight: "324px", border: "0.2px solid #ddd", borderRadius: "14px", padding: "18px", backgroundColor: "#FFFFFF", fontFamily: "Lexend, sans-serif" }}>
          <h3 style={{ fontWeight: "700", marginBottom: "15px", fontSize: "18px", color: "#1A1A1A" }}>Records</h3>

          {loading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>Loading sessions...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : sessions.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>No sessions available</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px", fontFamily: "Roboto, sans-serif", fontSize: "14px" }}>
              <thead>
                <tr>
                  {["User", "Session ID", "Status", "Energy (kWh)", "Cost (INR)", "Action"].map((header, idx) => (
                    <th key={idx} style={{ padding: "10px 12px", fontWeight: "600", textAlign: idx === 5 ? "center" : "left", color: "#333333", fontSize: "14px" }}>
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
                {sessions.map((rec) => (
                  <tr key={rec.id} style={{ backgroundColor: "#fff", borderRadius: "12px" }}>
                    <td style={{ padding: "12px" }}>{rec.user?.name || rec.userId}</td>
                    <td style={{ padding: "12px" }}>{rec.id}</td>
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
                        color: rec.status === "Active" ? "#00A000" :
                               rec.status === "Busy" ? "#D0A000" : "#FF0060",
                        backgroundColor: rec.status === "Active" ? "#E0FFE0" :
                                         rec.status === "Busy" ? "#FFF3CC" : "#FFE8E8",
                      }}>{rec.status}</span>
                    </td>
                    <td style={{ padding: "12px" }}>{rec.energyUsed || 0}</td>
                    <td style={{ padding: "12px" }}>₹{rec.cost || 0}</td>
                    <td style={{ display: "flex", justifyContent: "center", gap: "12px", padding: "12px", alignItems: "center" }}>
                      <img src={editIcon} alt="Edit" style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                      <img src={deleteIcon} alt="Delete" style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value, icon }) => (
  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#FFFFFF", borderRadius: "14px", padding: "18px 22px", border: "0.2px solid #ddd" }}>
    <img src={icon} alt="icon" style={{ width: "32px", height: "32px" }} />
    <div>
      <p style={{ fontSize: "14px", color: "#555", marginBottom: "6px" }}>{title}</p>
      <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#000" }}>{value}</h3>
    </div>
  </div>
);

export default Sessions;
