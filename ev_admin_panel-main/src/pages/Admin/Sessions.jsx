import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import totalIcon from "../../assets/icons/stationicon/Vector.svg";
import activeIcon from "../../assets/icons/stationicon/green.svg";
import uptimeIcon from "../../assets/icons/stationicon/yellow.svg";
import errorIcon from "../../assets/icons/stationicon/red.svg";
import sortIcon from "../../assets/icons/stationicon/upndown.svg";
import editIcon from "../../assets/icons/stationicon/edit.svg";
import deleteIcon from "../../assets/icons/stationicon/delete.svg";
import SessionChart from "../../components/admin/SessionChart";

const LoadingSpinner = () => (
  <div style={{ textAlign: "center", padding: "50px", fontSize: "18px", color: "#555" }}>
    Loading data...
  </div>
);

function Sessions({ baseUrl }) {
  const navigate = useNavigate();

  // State to store sessions
  const [sessions, setSessions] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalSessions: '...',
    activeSessions: '...',
    averageUptime: '...',
    errorToday: '...',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      setLoading(true);

      setSummaryData({
        totalSessions: '...',
        activeSessions: '...',
        averageUptime: '...',
        errorToday: '...',
      });
      setSessions([]);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login.");
        navigate("/");
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const endpoints = {
        total: "/sessions/total",
        active: "/sessions/active",
        uptime: "/sessions/uptime",
        errors: "/sessions/error/today",
        records: "/sessions/all/records",
      };

      const fetchSummaryItem = async (key, endpoint, transform = (v) => v) => {
        try {
          const res = await fetch(baseUrl + endpoint, { headers });
          if (res.status === 401 || res.status === 403) throw new Error('Auth failed');
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const text = await res.text();
          setSummaryData(prev => ({ ...prev, [key]: transform(text) }));
        } catch (err) {
          console.error(`Failed to fetch ${key}:`, err);
          if (err.message === 'Auth failed') {
            localStorage.removeItem("token");
            navigate("/");
          }
          setSummaryData(prev => ({ ...prev, [key]: 'Error' }));
        }
      };

      const fetchRecords = async () => {
        try {
          const res = await fetch(baseUrl + endpoints.records, { headers });
          if (res.status === 401 || res.status === 403) throw new Error('Auth failed');
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const data = await res.json();
          setSessions(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch sessions:", err);
          setSessions([]);
        } finally {
          setLoading(false);
        }
      };

      // Parallel individual fetches
      fetchSummaryItem('totalSessions', endpoints.total);
      fetchSummaryItem('activeSessions', endpoints.active);
      fetchSummaryItem('averageUptime', endpoints.uptime, (v) => `${parseFloat(v)}%`);
      fetchSummaryItem('errorToday', endpoints.errors);
      fetchRecords();
    };

    fetchSessionData();
  }, [navigate, baseUrl]);


  return (
    <div className="sessions-container">
      <style>
        {`
          .sessions-container {
            padding: 30px;
            font-family: 'Lexend', sans-serif;
            background-color: #F1F1F1;
            min-height: 100vh;
          }
          .sessions-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .sessions-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            color: #111;
          }
          .sessions-subtitle {
            font-size: 14px;
            color: #666;
            margin-top: 4px;
            margin-bottom: 30px;
          }
          .summary-wrapper {
            display: flex;
            justify-content: center;
            margin-bottom: 24px;
          }
          .summary-inner {
            display: flex;
            gap: 20px;
            max-width: 1140px;
            width: 100%;
          }
          .summary-card {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 16px;
            background-color: #FFFFFF;
            border-radius: 14px;
            padding: 18px 22px;
            border: 0.2px solid #ddd;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .card-icon {
            width: 32px;
            height: 32px;
          }
          .card-title {
            font-size: 14px;
            color: #555;
            margin-bottom: 6px;
          }
          .card-value {
            font-size: 22px;
            font-weight: 700;
            color: #000;
            margin: 0;
          }
          .records-wrapper {
            display: flex;
            justify-content: center;
            margin-top: 30px;
          }
          .records-container {
            width: 100%;
            max-width: 1140px;
            min-height: 324px;
            border-radius: 14px;
            padding: 24px;
            background-color: #FFFFFF;
            font-family: 'Lexend', sans-serif;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .records-title {
            font-weight: 700;
            margin-bottom: 20px;
            font-size: 18px;
            color: #1A1A1A;
          }
          .sessions-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 12px;
            font-family: 'Lexend', sans-serif;
            font-size: 14px;
          }
          .table-th {
            padding: 12px;
            font-weight: 600;
            color: #444;
            font-size: 13px;
            text-align: left;
          }
          .table-tr {
            background-color: #fff;
            border-radius: 12px;
            transition: box-shadow 0.2s;
          }
          .table-tr:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .table-td {
            padding: 16px 12px;
            color: #333;
          }
          .table-td:first-child { border-radius: 12px 0 0 12px; }
          .table-td:last-child { border-radius: 0 12px 12px 0; }
          .status-badge {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            padding: 4px 12px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 12px;
          }
          .status-active { background-color: #D1FAE5; color: #065a42ff; }
          .status-completed { background-color: #FFE4E6; color: #1257beff; }
          .status-error { background-color: #FFE4E6; color: #c21313ff; }
          .action-icon {
            width: 16px;
            height: 16px;
            cursor: pointer;
            opacity: 0.7;
          }
          .action-icon:hover {
            opacity: 1;
          }
        `}
      </style>

      {/* Header */}
      <div className="sessions-header">
        <div>
          <h2 className="sessions-title">Sessions</h2>
          <p className="sessions-subtitle">Manage session history and monitor live charging</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-wrapper">
        <div className="summary-inner">
          <Card title="Total Sessions" value={summaryData.totalSessions} icon={totalIcon} />
          <Card title="Active Sessions" value={summaryData.activeSessions} icon={activeIcon} />
          <Card title="Average Uptime" value={summaryData.averageUptime} icon={uptimeIcon} />
          <Card title="Error Today" value={summaryData.errorToday} icon={errorIcon} />
        </div>
      </div>

      {/* System Health Section */}
      <SessionChart />

      {/* Records Section */}
      <div className="records-wrapper">
        <div className="records-container">
          <h3 className="records-title">Records</h3>

          {loading ? (
            <LoadingSpinner />
          ) : sessions.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>
              No sessions available.
            </p>
          ) : (
            <table className="sessions-table">
              <thead>
                <tr>
                  {["Name", "Session ID", "Status", "Energy", "Cost (INR)", "Action"].map(
                    (header, index) => (
                      <th
                        key={index}
                        className="table-th"
                        style={{ textAlign: index === 5 ? "center" : "left" }}
                      >
                        {header !== "Action" ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {header}
                            <img src={sortIcon} alt="Sort" style={{ width: "12px", height: "12px", cursor: "pointer" }} />
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
                {sessions.map((rec) => (
                  <tr key={rec.id} className="table-tr">
                    <td className="table-td">{rec.charger?.ocppId || 'N/A'}</td>
                    <td className="table-td">{rec.id}</td>
                    <td className="table-td">
                      <span className={`status-badge ${rec.status === "ACTIVE" ? "status-active" : rec.status === "COMPLETED" ? "status-completed" : "status-error"}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="table-td">{rec.energyKwh ? `${rec.energyKwh} kWh` : 'N/A'}</td>
                    <td className="table-td">{`₹${rec.cost.toLocaleString('en-IN')}`}</td>
                    <td className="table-td" style={{ display: "flex", justifyContent: "center", gap: "12px", alignItems: "center" }}>
                      <img src={editIcon} alt="Edit" className="action-icon" />
                      <img src={deleteIcon} alt="Delete" className="action-icon" />
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
  <div className="summary-card">
    <img src={icon} alt="icon" className="card-icon" />
    <div>
      <p className="card-title">{title}</p>
      <h3 className="card-value">{value}</h3>
    </div>
  </div>
);

export default Sessions;
