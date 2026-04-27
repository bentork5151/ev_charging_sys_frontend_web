import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterCard from "./form/RegisterCard";
import plusIcon from "../../assets/icons/stafficon/plus.svg";

import totalIcon from "../../assets/icons/stationicon/Vector.svg";
import activeIcon from "../../assets/icons/stationicon/green.svg";
import uptimeIcon from "../../assets/icons/stationicon/yellow.svg";
import errorIcon from "../../assets/icons/stationicon/red.svg";
import sortIcon from "../../assets/icons/stationicon/upndown.svg";
import editIcon from "../../assets/icons/stationicon/edit.svg";
import deleteIcon from "../../assets/icons/stationicon/delete.svg";

// Simple Loading Spinner
const LoadingSpinner = () => (
  <div style={{ textAlign: "center", padding: "50px", fontSize: "18px", color: "#555" }}>
    Loading data...
  </div>
);

// Modal Component
const Modal = ({ children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      {children}
    </div>
  </div>
);

function Users({ baseUrl }) {
  const navigate = useNavigate();

  // State
  const [users, setUsers] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalCards: 0,
    activeCards: 0,
    inactiveCards: 0,
    recentlyAdded: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch Data
  useEffect(() => {
    const fetchSessionData = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const apiPrefix = baseUrl;

      const fetchSummaryItem = async (key, endpoint) => {
        try {
          const res = await fetch(`${apiPrefix}${endpoint}`, { headers });
          if (res.status === 401 || res.status === 403) throw new Error('Auth failed');
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const text = await res.text();
          setSummaryData(prev => ({ ...prev, [key]: text || 0 }));
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
          const res = await fetch(`${apiPrefix}/rfid-card`, { headers });
          if (res.status === 401 || res.status === 403) throw new Error('Auth failed');
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : []);

          // Calculate recently added after fetching all
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const recentCount = data.filter(r => new Date(r.createdAt) >= sevenDaysAgo).length;
          setSummaryData(prev => ({ ...prev, recentlyAdded: recentCount }));
        } catch (err) {
          console.error("Failed to fetch records:", err);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      };

      // Start all fetches
      fetchSummaryItem('totalCards', '/rfid-card/total');
      fetchSummaryItem('activeCards', '/rfid-card/active');
      fetchSummaryItem('inactiveCards', '/rfid-card/inactive');
      fetchRecords();
    };

    fetchSessionData();
  }, [navigate, refreshKey, baseUrl]);

  const handleCardRegistered = () => {
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/rfid-card/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (res.ok) {
        setRefreshKey(prev => prev + 1);
      } else {
        alert("Failed to delete card");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting card");
    }
  };

  return (
    <>
      <style>
        {`
          .rfid-container {
            padding: 24px;
            font-family: 'Roboto', sans-serif;
            background-color: #F8F9FA;
            min-height: 100vh;
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }
          .page-title {
            font-size: 28px;
            font-weight: 500;
            margin: 0;
            font-family: 'Lexend', sans-serif;
            color: #111;
          }
          .register-btn {
            background-color: #111;
            color: #fff;
            border: none;
            border-radius: 999px;
            padding: 10px 24px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.2s;
          }
          .register-btn:hover {
            background-color: #333;
          }
          
          /* Stats Cards */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 24px;
          }
          .stat-card {
            background: #fff;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            border: 1px solid #E5E7EB;
            min-height: 120px;
          }
          .stat-header {
            font-size: 13px;
            color: #6B7280;
            font-weight: 500;
            margin-bottom: 12px;
          }
          .stat-value {
             font-size: 32px;
             font-weight: 700;
             color: #111;
             font-family: 'Lexend', sans-serif;
             margin-bottom: 4px;
          }
          .stat-subtext {
            font-size: 12px;
            color: #000000ff; /* Greenish for positive styling */
            font-weight: 500;
          }
          .stat-icon-wrapper {
             align-self: flex-end; /* Move arrow icon to right */
          }

          /* Graphical Overview */
          .graph-section {
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid #E5E7EB;
            min-height: 250px;
            position: relative;
          }
          .section-title {
            font-size: 18px;
            font-weight: 400;
            color: #111;
            margin-bottom: 8px;
            font-family: 'Lexend', sans-serif;
          }
          .section-subtitle {
            font-size: 12px;
            color: #6B7280;
            margin-bottom: 20px;
          }
          
          /* Directory Table */
          .directory-section {
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            border: 1px solid #E5E7EB;
          }
          .table-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .table-container {
            width: 100%;
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: separate; 
            border-spacing: 0;
            font-size: 14px;
          }
          th {
            text-align: left;
            padding: 16px;
            font-weight: 600;
            color: #111;
            border-bottom: 1px solid #E5E7EB;
          }
          td {
            padding: 16px;
            color: #374151;
            border-bottom: 1px solid #F3F4F6;
          }
          tr:last-child td {
            border-bottom: none;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
          }
          .status-active {
            background-color: #ECFDF5;
            color: #059669;
          }
          .status-inactive {
            background-color: #FEF2F2;
            color: #DC2626;
          }
          .status-error {
             background-color: #FEF2F2;
            color: #DC2626;
          }
          
          .action-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            opacity: 0.7;
            transition: opacity 0.2s;
          }
          .action-btn:hover {
            opacity: 1;
          }

          /* Modal CSS */
          .modal-overlay {
            position: fixed;
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex; 
            align-items: center; 
            justify-content: center;
            z-index: 2000;
          }
          .modal-content {
            background: white; 
            border-radius: 16px;
            display: flex; 
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
        `}
      </style>

      <div className="rfid-container">

        {/* Header */}
        <div className="header-row">
          <h2 className="page-title">RFID Manager</h2>
          {/* Note: The new design doesn't explicitly show the Register button in the top right, but it's good UX to keep it or place it in Directory. 
              Image 1 has "Register Card" inside the Directory section. Let's move it there to match Image 1 exactly. 
          */}
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <StatCard title="Total Cards" value={summaryData.totalCards} subtext="+10 from last week" />
          <StatCard title="Active Cards" value={summaryData.activeCards} subtext="+10 from last week" />
          <StatCard title="In-active Cards" value={summaryData.inactiveCards} subtext="+10 from last week" />
          <StatCard title="Recently Added" value={summaryData.recentlyAdded} subtext="+10 from last week" />
        </div>

        {/* Graphical Overview */}
        <div className="graph-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 className="section-title">Graphical Overview</h3>
              <p className="section-subtitle">Real-time monitoring data</p>
            </div>
            {/* Chart Icon Placeholder */}
            <div style={{ color: '#10B981' }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', background: '#F9FAFB', borderRadius: '8px', border: '1px dashed #E5E7EB' }}>
            Chart Placeholder
          </div>
        </div>

        {/* Directory Section */}
        <div className="directory-section">
          <div className="table-header-row">
            <h3 className="section-title" style={{ fontSize: '20px', margin: 0 }}>Directory</h3>

            <button className="register-btn" onClick={() => setIsModalOpen(true)}>
              <img src={plusIcon} alt="" style={{ width: 16, height: 16 }} />
              Register Card
            </button>
          </div>

          <div className="table-container">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Registration Date</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((rec) => (
                    <tr key={rec.id}>
                      <td>{rec.user?.name || 'Unknown User'}</td>
                      <td style={{ fontFamily: 'monospace', color: '#6B7280' }}>{rec.cardNumber}</td>
                      <td>
                        <span className={`status-badge ${rec.active ? 'status-active' : 'status-inactive'}`}>
                          {rec.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{rec.createdAt ? new Date(rec.createdAt).toLocaleString() : 'N/A'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="action-btn" title="Edit">
                          <img src={editIcon} alt="Edit" style={{ width: 18, height: 18 }} />
                        </button>
                        <button className="action-btn" title="Delete" onClick={() => handleDelete(rec.id)}>
                          <img src={deleteIcon} alt="Delete" style={{ width: 18, height: 18 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                        No RFID cards found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {/* Note: RegisterCard uses {baseUrl}/rfid-card/register.
              If backend needs /api prefix, we must supply it.
          */}
          <RegisterCard
            onClose={() => setIsModalOpen(false)}
            onCardRegistered={handleCardRegistered}
            baseUrl={baseUrl}
          />
        </Modal>
      )}
    </>
  );
}

// Sub-component for Stats
const StatCard = ({ title, value, subtext }) => (
  <div className="stat-card">
    <div>
      <div className="stat-header">{title}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-subtext">{subtext}</div>
    </div>
    <div className="stat-icon-wrapper" style={{ color: '#10B981' }}>
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </div>
  </div>
);

export default Users;
