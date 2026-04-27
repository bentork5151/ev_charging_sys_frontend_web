import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const chartData = [
  { name: "Mon", cases: 4 },
  { name: "Tue", cases: 3 },
  { name: "Wed", cases: 2 },
  { name: "Thu", cases: 5 },
  { name: "Fri", cases: 6 },
  { name: "Sat", cases: 4 },
  { name: "Sun", cases: 3 },
];

export default function MaintenanceDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manual");

  const records = [
    { id: "S-82037173", station: "Highway Rest A", charger: "Charger #11", issue: "Power Surge", reported: "1 hrs ago", status: "Error", respondedBy: "Emergency Team A" },
    { id: "S-82037173", station: "Highway Rest B", charger: "Charger #13", issue: "Power Surge", reported: "1 hrs ago", status: "Error", respondedBy: "Emergency Team A" },
    { id: "S-82037173", station: "Highway Rest C", charger: "Charger #119", issue: "Power Surge", reported: "2 hrs ago", status: "Error", respondedBy: "Emergency Team A" },
    { id: "S-82037173", station: "Highway Rest D", charger: "Charger #111", issue: "Power Surge", reported: "4 hrs ago", status: "Error", respondedBy: "Emergency Team A" },
    { id: "S-82037173", station: "Highway Rest D", charger: "Charger #111", issue: "Power Surge", reported: "4 hrs ago", status: "Error", respondedBy: "Emergency Team A" },
  ];

  return (
    <>
      <style>{`
        .dashboard-container {
          width: 100%;
          background: #f1f1f1;
          min-height: 100vh;
          padding: 24px;
          box-sizing: border-box;
          font-family: 'Lexend', sans-serif;
        }

        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .header-left h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .icon-btn {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #e0e0e0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #eee;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 110px;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #111;
        }

        .graph-container {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #eee;
          margin-bottom: 24px;
        }

        .graph-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .records-section {
          background: #fff;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid #eee;
          margin-bottom: 60px;
        }

        .records-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .toggle-container {
          display: flex;
          background: #f1f1f1;
          border-radius: 20px;
          padding: 4px;
          gap: 4px;
        }

        .toggle-btn {
          padding: 8px 24px;
          border-radius: 18px;
          border: none;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-btn.active {
          background: #1a1a1a;
          color: white;
        }

        .toggle-btn:not(.active) {
          background: transparent;
          color: #666;
        }

        .records-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .records-table th {
          text-align: left;
          padding: 12px 16px;
          color: #666;
          font-weight: 500;
          font-size: 13px;
          border-bottom: 1px solid #f0f0f0;
        }

        .records-table td {
          padding: 16px;
          font-size: 14px;
          color: #333;
          border-bottom: 1px solid #f0f0f0;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          background: #ffe5ea;
          color: #ff3b5c;
        }

        .action-btn {
          padding: 6px 14px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
        }

        .switch-emergency-container {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 100;
        }

        .switch-emergency-btn {
          background: #111;
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }

        .switch-emergency-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="dashboard-container">
        <div className="top-header">
          <div className="header-left">
            <h2>Maintenance</h2>
          </div>

        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Active <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span>
            <span className="stat-value">14</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Scheduled Today <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></span>
            <span className="stat-value">1</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">In Progress <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></svg></span>
            <span className="stat-value">1</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completed This Week <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg></span>
            <span className="stat-value">3</span>
          </div>
        </div>

        <div className="graph-container">
          <div className="graph-header">
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>Graphical Overview</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#666' }}>Real-time monitoring data</p>
            </div>
            <div className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="cases" stroke="#10b981" fillOpacity={1} fill="url(#colorCases)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="records-section">
          <div className="records-header">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Records</h3>
            <div className="toggle-container">
              <button
                className={`toggle-btn ${activeTab === "manual" ? "active" : ""}`}
                onClick={() => setActiveTab("manual")}
              >
                Manual
              </button>
              <button
                className={`toggle-btn ${activeTab === "automatic" ? "active" : ""}`}
                onClick={() => setActiveTab("automatic")}
              >
                Automatic
              </button>
            </div>
          </div>

          <table className="records-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Station</th>
                <th>Charger</th>
                <th>Issue</th>
                <th>Reported</th>
                <th>Status</th>
                <th>Responded By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td style={{ color: '#666' }}>{record.id}</td>
                  <td>{record.station}</td>
                  <td>{record.charger}</td>
                  <td>{record.issue}</td>
                  <td>{record.reported}</td>
                  <td><span className="status-badge">Error</span></td>
                  <td>{record.respondedBy}</td>
                  <td><button className="action-btn">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="switch-emergency-container">
          <button
            className="switch-emergency-btn"
            onClick={() => navigate("/dashboard/maintenance")}
          >
            Switch to Emergency
          </button>
        </div>
      </div>
    </>
  );
}
