import React, { useState, useEffect } from "react";
// import React, { useState, useEffect } from "react";
import SessionPage from "./form/SessionPage";  // ✅ import fixed


import totalIcon from "../../assets/icons/stationicon/Vector.svg";
import activeIcon from "../../assets/icons/stationicon/green.svg";
import uptimeIcon from "../../assets/icons/stationicon/yellow.svg";
import errorIcon from "../../assets/icons/stationicon/red.svg";
import sortIcon from "../../assets/icons/stationicon/upndown.svg";
import editIcon from "../../assets/icons/stationicon/edit.svg";
import deleteIcon from "../../assets/icons/stationicon/delete.svg";
import SessionChart from "../../components/admin/SessionChart";



function Sessions() {
  // State to store sessions
  const [sessions, setSessions] = useState([]);
const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load sessions from localStorage if exists
    const storedSessions = localStorage.getItem("sessions");
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Roboto, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "20px",
            fontFamily: "Lexend, sans-serif",
          }}
        >
          Sessions
        </h2>

       <button
  style={{
    width: "160px",
    height: "45px",
    borderRadius: "18px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 500,
    border: "none",
    cursor: "pointer",
  }}
  onClick={() => setOpen(true)}
>
  Customize
</button>
<SessionPage open={open} setOpen={setOpen} />
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            maxWidth: "1106px",
            width: "100%",
          }}
        >
          <Card title="Total Sessions" value={sessions.length} icon={totalIcon} />
          <Card
            title="Active Sessions"
            value={sessions.filter((s) => s.status === "Active").length}
            icon={activeIcon}
          />
          <Card title="Average Uptime" value="76%" icon={uptimeIcon} />
          <Card title="Error Today" value="3" icon={errorIcon} />
        </div>
      </div>

      {/* System Health Section */}
          <SessionChart />

      {/* Records Section */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <div
          style={{
            width: "1140px",
            minHeight: "324px",
            border: "0.2px solid #ddd",
            borderRadius: "14px",
            padding: "18px",
            backgroundColor: "#FFFFFF",
            fontFamily: "Lexend, sans-serif",
          }}
        >
          <h3
            style={{
              fontWeight: "700",
              marginBottom: "15px",
              fontSize: "18px",
              color: "#1A1A1A",
            }}
          >
            Records
          </h3>

          {sessions.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>
              No sessions available.
            </p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 12px",
                fontFamily: "Roboto, sans-serif",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr>
                  {["Name", "Session ID", "Status", "Energy", "Cost (INR)", "Action"].map(
                    (header, index) => (
                      <th
                        key={index}
                        style={{
                          padding: "10px 12px",
                          fontWeight: "600",
                          textAlign: index === 5 ? "center" : "left",
                          color: "#333333",
                          fontSize: "14px",
                        }}
                      >
                        {header !== "Action" ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {header}
                            <img
                              src={sortIcon}
                              alt="Sort"
                              style={{
                                width: "12px",
                                height: "12px",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        ) : (
                          header
                        )}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {sessions.map((rec, idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                    }}
                  >
                    <td style={{ padding: "12px" }}>{rec.name}</td>
                    <td style={{ padding: "12px" }}>{rec.id}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "72px",
                          height: "26px",
                          borderRadius: "15px",
                          fontWeight: 600,
                          fontSize: "12px",
                          color: rec.status === "Busy" ? "#D0A000" : "#FF0060",
                          backgroundColor: rec.status === "Busy" ? "#FFF3CC" : "#FFE8E8",
                        }}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>{rec.energy}</td>
                    <td style={{ padding: "12px" }}>{rec.cost}</td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "12px",
                        padding: "12px",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={editIcon}
                        alt="Edit"
                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                      />
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
  <div
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: "16px",
      backgroundColor: "#FFFFFF",
      borderRadius: "14px",
      padding: "18px 22px",
      border: "0.2px solid #ddd",
    }}
  >
    <img src={icon} alt="icon" style={{ width: "32px", height: "32px" }} />
    <div>
      <p style={{ fontSize: "14px", color: "#555", marginBottom: "6px" }}>{title}</p>
      <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#000" }}>{value}</h3>
    </div>
  </div>
);

export default Sessions;
