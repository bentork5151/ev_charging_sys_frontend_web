import React, { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
// import AddStation from "./form/AddStation";

import totalIcon from "../../assets/icons/stationicon/Vector.svg";
import activeIcon from "../../assets/icons/stationicon/green.svg";
import uptimeIcon from "../../assets/icons/stationicon/yellow.svg";
import errorIcon from "../../assets/icons/stationicon/red.svg";
import sortIcon from "../../assets/icons/stationicon/upndown.svg";
import editIcon from "../../assets/icons/stationicon/edit.svg";
import plusIcon from "../../assets/icons/stafficon/plus.svg";
import deleteIcon from "../../assets/icons/stationicon/delete.svg";
import StationOverviewChart from "../../components/admin/StationOverviewChart";

const AddStation = lazy(() => import('./form/AddStation'));
const EditStation = lazy(() => import('./form/EditStation'));

const LoadingSpinner = () => (
  <div className="loading-spinner">
    Loading data...
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      {children}
    </div>
  </div>
);

function Stations({ baseUrl }) {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalStations: '...',
    activeStations: '...',
    averageUptime: '...',
    errorToday: '...',
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStationData = async () => {
      setLoading(true);

      setSummaryData({
        totalStations: '...',
        activeStations: '...',
        averageUptime: '...',
        errorToday: '...',
      });
      setStations([]);

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
        total: "/stations/total",
        active: "/stations/active",
        uptime: "/stations/uptime",
        errors: "/stations/error/today",
        records: "/stations/all",
      };

      try {
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
          setStations(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch records:", err);
          setStations([]);
        } finally {
          setLoading(false);
        }
      };

      // Start all fetches in parallel independently
      fetchSummaryItem('totalStations', endpoints.total);
      fetchSummaryItem('activeStations', endpoints.active);
      fetchSummaryItem('averageUptime', endpoints.uptime, (v) => `${parseFloat(v)}%`);
      fetchSummaryItem('errorToday', endpoints.errors);
      fetchRecords();
      } catch (err) {
        console.error("Error in fetchStationData:", err);
      }
    };

    fetchStationData();
  }, [navigate, refreshKey, baseUrl]);

  const handleStationAdded = () => {
    setIsModalOpen(false);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleEdit = (sta) => {
    setSelectedStation(sta);
    setIsEditModalOpen(true);
  };

  const handleStationUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedStation(null);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const getStatusClass = (status) => {
    if (status === "ACTIVE") return "status-active";
    if (status === "COMPLETED") return "status-completed";
    return "status-error";
  };


  return (
    <>
      <style>
        {`
            .stations-page-container {
                padding: 30px;
                font-family: 'Roboto', sans-serif;
                background-color: #F3F4F6;
                min-height: 100vh;
            }
            .loading-spinner {
                text-align: center;
                padding: 50px;
                font-size: 18px;
                color: #555;
            }
            .modal-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .modal-content {
                background-color: white;
                border-radius: 16px;
                width: 90%;
                height: 90%;
                max-width: 1200px;
                max-height: 800px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .summary-cards-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
                margin-bottom: 30px;
            }
            .station-card {
                background-color: white;
                border-radius: 16px;
                padding: 24px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                min-height: 130px;
            }
            .card-header {
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 8px;
            }
            .card-title {
                font-size: 12px;
                color: #666;
                font-weight: 500;
            }
            .card-icon {
                width: 20px;
                height: auto;
            }
            .card-value {
                font-size: 32px;
                font-weight: 700;
                color: #111;
                line-height: 1.2;
                margin-bottom: 8px;
            }
            .card-subtext {
                font-size: 11px;
                color: #888;
            }
            .system-health-section {
                background-color: white;
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            }
            .health-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
            }
            .health-title {
                font-size: 16px;
                font-weight: 600;
                color: #111;
                margin: 0;
            }
            .health-subtitle {
                font-size: 12px;
                color: #666;
                margin-top: 4px;
            }
            .health-chart-container {
                min-height: 300px;
            }
            .stations-list-section {
                background-color: #fff;
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                font-family: 'Lexend', sans-serif;
            }
            .list-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
            }
            .list-title {
                font-size: 20px;
                font-weight: 600;
                color: #111;
                margin: 0;
            }
            .create-btn {
                background-color: #222;
                color: #fff;
                border-radius: 20px;
                padding: 8px 24px;
                font-size: 13px;
                font-weight: 500;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .create-plus {
                font-size: 16px;
                font-weight: 400;
            }
            .empty-state {
                text-align: center;
                padding: 20px;
                color: #888;
            }
            .stations-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
            }
            .table-header-row {
                text-align: left;
            }
            .table-th {
                font-size: 12px;
                font-weight: 700;
                color: #111;
                padding: 10px 10px;
                padding-bottom: 20px;
            }
            .table-row {
                font-size: 13px;
                color: #333;
            }
            .table-td {
                padding: 20px 10px;
            }
            .td-name {
                font-weight: 600;
            }
            .status-badge {
                display: inline-block;
                padding: 6px 20px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                text-align: center;
                min-width: 80px;
            }
            .status-active {
                background-color: #E8F5E9;
                color: #2E7D32;
            }
            .status-completed {
                background-color: #E3F2FD;
                color: #1565C0;
            }
            .status-error {
                background-color: #FFCDD2;
                color: #C62828;
            }
            .link-text {
                color: #666;
                text-decoration: none;
            }
            .action-buttons {
                display: flex;
                gap: 16px;
                justify-content: center;
            }
            .icon-btn {
                border: none;
                background: none;
                cursor: pointer;
                padding: 0;
            }
            .search-bar-container {
                display: flex;
                gap: 16px;
                margin-bottom: 30px;
                align-items: center;
                width: 100%;
            }
            .search-input-wrapper {
                flex: 1;
                background-color: #fff;
                border-radius: 20px;
                padding: 10px 16px;
                display: flex;
                align-items: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            .search-input {
                border: none;
                background: none;
                outline: none;
                width: 100%;
                font-size: 14px;
            }
            .filter-export-buttons {
                display: flex;
                gap: 12px;
            }
            .filter-btn {
                background-color: #fff;
                border: none;
                border-radius: 20px;
                padding: 10px 20px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #333;
                min-width: 100px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            .export-btn {
                background-color: #111;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 10px 24px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
            }
        `}
      </style>
      <div className="stations-page-container">

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <AddStation
              onClose={() => setIsModalOpen(false)}
              onStationAdded={handleStationAdded}
              baseUrl={baseUrl}
            />
          </Modal>
        )}

        {isEditModalOpen && (
          <Modal onClose={() => setIsEditModalOpen(false)}>
            <EditStation
              station={selectedStation}
              onClose={() => setIsEditModalOpen(false)}
              onStationUpdated={handleStationUpdated}
              baseUrl={baseUrl}
            />
          </Modal>
        )}
        <h1>STATIONS & LOCATIONS</h1>
        {/* Summary Cards */}
        <div className="summary-cards-grid">

          <Card title="Total Stations" value={summaryData.totalStations} icon={totalIcon} subtext="+2 from last month" />
          <Card title="Active Stations" value={summaryData.activeStations} icon={activeIcon} subtext="+75 operational" />
          <Card title="Average Uptime" value={summaryData.averageUptime} icon={uptimeIcon} subtext="-1.8% from last week" />
          <Card title="Errors" value={summaryData.errorToday} icon={errorIcon} subtext="+1 from last month" />
        </div>



        {/* System Health Section */}
        <div className="system-health-section">
          <div className="health-header">
            <div>
              <h3 className="health-title">System Health Overview</h3>
              <p className="health-subtitle">Real-time monitoring of station performance</p>
            </div>
            <img src={activeIcon} alt="" style={{ width: "20px", opacity: 0.8 }} />
          </div>
          <div className="health-chart-container">
            <StationOverviewChart />
          </div>
        </div>
        {/* Search Bar */}
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by Name or Location ID"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-export-buttons">
            <button className="filter-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filter
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <button className="export-btn">Export</button>
          </div>
        </div>
        {/* Stations List Section */}
        <div className="stations-list-section">

          <div className="list-header">
            <h3 className="list-title">Stations</h3>
            <button
              className="create-btn"
              onClick={() => setIsModalOpen(true)}>
              <span className="create-plus">+</span> Create
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : stations.filter(sta =>
            (sta.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sta.locationId && sta.locationId.toString().toLowerCase().includes(searchTerm.toLowerCase()))
          ).length === 0 ? (
            <p className="empty-state">
              {searchTerm ? `No stations found matching "${searchTerm}"` : "No station available."}
            </p>
          ) : (
            <table className="stations-table">
              <thead>
                <tr className="table-header-row">
                  {["Name", "Location ID", "Status", "Created at", "Direction Link", "Action"].map((h, i) => (
                    <th key={i} className="table-th" style={{ textAlign: i === 5 ? "center" : "left" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stations
                  .filter(sta =>
                    (sta.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (sta.locationId && sta.locationId.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((sta) => (
                    <tr key={sta.id} className="table-row">
                      <td className="table-td td-name">{sta.name || 'N/A'}</td>
                      <td className="table-td">{sta.locationId || 'N/A'}</td>
                      <td className="table-td">
                        <span className={`status-badge ${getStatusClass(sta.status)}`}>
                          {sta.status === "ACTIVE" ? "Active" : sta.status === "COMPLETED" ? "Completed" : "Error"}
                        </span>
                      </td>
                      <td className="table-td">{sta.createdAt ? new Date(sta.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="table-td">
                        <a href={sta.directionLink || "#"} target="_blank" rel="noopener noreferrer" className="link-text">(LINK GOES HERE)</a>
                      </td>
                      <td className="table-td">
                        <div className="action-buttons">
                          <button
                            className="icon-btn"
                            onClick={() => handleEdit(sta)}
                          >
                            <img src={editIcon} alt="Edit" style={{ width: "16px" }} />
                          </button>
                          <button className="icon-btn"><img src={deleteIcon} alt="Del" style={{ width: "14px" }} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </>
  );
}

const Card = ({ title, value, icon, subtext }) => (
  <div className="station-card">
    <div className="card-header">
      <span className="card-title">{title}</span>
      <img src={icon} alt="" className="card-icon" />
    </div>

    <div>
      <div className="card-value">{value}</div>
      <div className="card-subtext">{subtext}</div>
    </div>
  </div>
);

export default Stations;