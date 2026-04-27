import React, { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import plusIcon from "../../assets/icons/stafficon/plus.svg";
import VectorIcon from "../../assets/icons/stafficon/Vector-3.svg";
import editIcon from "../../assets/icons/stationicon/edit.svg";
import deleteIcon from "../../assets/icons/stationicon/delete.svg";
import sortIcon from "../../assets/icons/stationicon/upndown.svg";

const AddCharger = lazy(() => import('./form/AddCharger'));

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      Loading data...
    </div>
  );
}

const Model = ({ children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
};

// Search Bar Component equivalent inline to match design exactly
const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="search-bar-container">
    <div className="search-input-wrapper">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        placeholder="Search"
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
);

function Charger({ baseUrl }) {
  const navigate = useNavigate();
  const [chargerData, setChargerData] = useState({
    totalData: "",
    availableData: "",
    acChargerData: "",
    dcChargerData: ""
  });
  const [chargerRecoards, setChargerRecoards] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setChargerData({
        totalData: '...',
        availableData: '...',
        acChargerData: '...',
        dcChargerData: '...'
      });
      setChargerRecoards([]);

      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token not found, redirecting to login')
        navigate('/')
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      try {

        const endpoints = {
          total: '/chargers/total',
          available: '/chargers/available',
          acCharger: '/chargers/ac',
          dcCharger: '/chargers/dc',
          allRecoards: '/chargers/all'
        }

      const fetchSummaryItem = async (key, endpoint) => {
        try {
          const res = await fetch(baseUrl + endpoint, { headers });
          if (res.status === 401 || res.status === 403) throw new Error('Auth failed');
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const text = await res.text();
          setChargerData(prev => ({ ...prev, [key]: text }));
        } catch (err) {
          console.error(`Failed to fetch ${key}:`, err);
          if (err.message === 'Auth failed') {
            localStorage.removeItem("token");
            navigate("/");
          }
          setChargerData(prev => ({ ...prev, [key]: 'Error' }));
        }
      };

      const fetchRecords = async () => {
        try {
          const res = await fetch(baseUrl + endpoints.allRecoards, { headers });
          if (res.status === 401 || res.status === 403) throw new Error('Auth failed');
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const data = await res.json();
          setChargerRecoards(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch records:", err);
        } finally {
          setLoading(false);
        }
      };

      // Start all fetches in parallel independently
      fetchSummaryItem('totalData', endpoints.total);
      fetchSummaryItem('availableData', endpoints.available);
      fetchSummaryItem('acChargerData', endpoints.acCharger);
      fetchSummaryItem('dcChargerData', endpoints.dcCharger);
      fetchRecords();

      } catch (error) {
        console.error('Failed to fetch charger data', error)

        if (error.message.includes('Authentication failed')) {
          console.error('Authentication error, navigating to login', error)
          localStorage.removeItem('token');
          navigate('/')
          return;
        }

        setChargerData({
          totalData: 'Error',
          availableData: 'Error',
          acChargerData: 'Error',
          dcChargerData: 'Error'
        });
        setChargerRecoards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl, navigate, refreshKey]);

  const handleChargerAdded = () => {
    setIsModelOpen(false);
    setRefreshKey(prevKey => prevKey + 1);
  }

  // Double check fetching logic here if needed, but keeping existing one...
  // The second useEffect in original file was redundant/duplicate. Removed for cleaner code.

  const cards = [
    { title: "Total Chargers", value: chargerData.totalData, value1: "+317 from last month", icon: VectorIcon },
    { title: "Available Chargers", value: chargerData.availableData, value1: "+224 from last month", icon: VectorIcon },
    { title: "AC Chargers", value: chargerData.acChargerData, value1: "+124 from last month", icon: VectorIcon },
    { title: "DC Chargers", value: chargerData.dcChargerData, value1: "+84 from last month", icon: VectorIcon },
  ];

  const filteredRecords = chargerRecoards.filter(charger => {
    const searchLow = searchTerm.toLowerCase();
    return (
      (charger.stationId && charger.stationId.toString().toLowerCase().includes(searchLow)) ||
      (charger.chargerType && charger.chargerType.toLowerCase().includes(searchLow)) ||
      (charger.connectorType && charger.connectorType.toLowerCase().includes(searchLow))
    );
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle string/number comparison
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <style>
        {`
            .charger-page-container {
                width: 100%;
                min-height: 100vh;
                font-family: 'Roboto', sans-serif;
                background-color: #F1F1F1;
                padding: 30px;
            }
            .page-header {
                display: flex;
                align-items: center;
                margin-bottom: 24px;
            }
            .page-title {
                font-size: 24px;
                font-weight: 700;
                font-family: 'Lexend', sans-serif;
                margin: 0;
                color: #111;
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
                max-width: 900px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .cards-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
                margin-bottom: 30px;
            }
            .stat-card {
                background-color: white;
                border-radius: 12px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                min-height: 110px;
                position: relative;
            }
            .card-title {
                font-size: 13px;
                color: #666;
                font-weight: 500;
                margin-bottom: 8px;
            }
            .card-value {
                font-size: 28px;
                font-weight: 700;
                color: #111;
                margin-bottom: 4px;
            }
            .card-subtext {
                font-size: 11px;
                color: #2E7D32; /* Green text for growth */
                font-weight: 500;
            }
            .card-arrow {
                position: absolute;
                bottom: 20px;
                right: 20px;
                color: #2E7D32;
            }
            .search-bar-container {
                display: flex;
                gap: 16px;
                margin-bottom: 30px;
                align-items: center;
            }
            .search-input-wrapper {
                flex: 1;
                background-color: #F3F4F6;
                border-radius: 20px; /* Fully rounded */
                padding: 10px 16px;
                display: flex;
                align-items: center;
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
                background-color: #F3F4F6;
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
            .table-container {
                background-color: white;
                border-radius: 12px; /* Less rounded than before to match image */
                padding: 20px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }
            .table-header-actions {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 20px;
                gap: 12px;
            }
            .add-charger-btn {
                background-color: #222;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 20px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .manage-btn {
                background-color: white;
                color: #333;
                border: 1px solid #eee;
                border-radius: 20px;
                padding: 8px 20px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
            }
            .charger-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
            }
            .table-th {
                text-align: left;
                font-size: 12px;
                font-weight: 700;
                color: #111;
                padding: 12px;
                border-bottom: 1px solid #f0f0f0;
            }
            .table-td {
                padding: 16px 12px;
                font-size: 13px;
                color: #333;
                border-bottom: 1px solid #f9f9f9;
            }
            .status-badge {
                display: inline-block;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                text-align: center;
            }
            .badge-online {
                background-color: #D1FAE5;
                color: #065F46;
            }
            .badge-offline {
                background-color: #FFE4E6;
                color: #BE123C;
            }
            .badge-available {
                color: #333;
            }
            .charge-mode-badge {
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                text-align: center;
                display: inline-block;
                width: 80px;
            }
            .mode-fast {
                background-color: #DBEAFE;
                color: #1E40AF;
            }
            .mode-standard {
                background-color: #E0F2FE;
                color: #0369A1;
            }
            .connector-badge {
                border: 1px solid #eee;
                padding: 4px 12px;
                border-radius: 6px;
                font-size: 12px;
                background: white;
                display: inline-block;
            }
            .type-badge {
                background-color: #111;
                color: white;
                padding: 4px 16px;
                border-radius: 20px;
                font-size: 11px;
                display: inline-block;
            }
            .type-badge-ac {
                background-color: #F3F4F6;
                color: #111;
            }
            .action-icons {
                display: flex;
                gap: 12px;
                justify-content: center;
            }
            .icon-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
            }
        `}
      </style>

      <div className="charger-page-container">
        {/* Header */}
        <div className="page-header">
          <h2 className="page-title">Charger Management</h2>
        </div>

        {/* Cards */}
        <div className="cards-grid">
          {cards.map((card, index) => (
            <div key={index} className="stat-card">
              <div>
                <div className="card-title">{card.title}</div>
                <div className="card-value">{card.value}</div>
                <div className="card-subtext">{card.value1}</div>
              </div>
              <div className="card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Table Section */}
        <div className="table-container">
          <div className="table-header-actions">
            <button className="add-charger-btn" onClick={() => setIsModelOpen(true)}>
              <span style={{ fontSize: "16px" }}>+</span> Add Charger
            </button>
            <button className="manage-btn">Manage</button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : sortedRecords.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>
              {searchTerm ? `No chargers found matching "${searchTerm}"` : "No chargers available."}
            </p>
          ) : (
            <table className="charger-table">
              <thead>
                <tr>
                  {["ID", "Station ID", "OCPP ID", "Connector", "Type", "Rate", "Charge Mode", "Status", "Availability", "Action"].map((h, i) => (
                    <th
                      key={i}
                      className="table-th"
                      style={{
                        textAlign: i === 9 ? "center" : "left",
                        cursor: h === "ID" ? "pointer" : "default"
                      }}
                      onClick={h === "ID" ? () => requestSort('id') : undefined}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {h}
                        {h === "ID" && (
                          <img
                            src={sortIcon}
                            alt="sort"
                            style={{
                              width: '12px',
                              opacity: sortConfig.key === 'id' ? 1 : 0.3,
                              transform: sortConfig.key === 'id' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s'
                            }}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map((charger) => {
                  const isFast = charger.chargeMode === 'Fast' || charger.chargeMode === 'Ultra Fast';

                  return (
                    <tr key={charger.id}>
                      <td className="table-td">{charger.id}</td>
                      <td className="table-td">{charger.stationId || 'Text Goes Here'}</td>
                      <td className="table-td" style={{ textAlign: "left" }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <span>{charger.ocppId || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="table-td">
                        <span className="connector-badge">{charger.connectorType || "CCS2"}</span>
                      </td>
                      <td className="table-td">
                        <span className={`type-badge ${charger.chargerType === 'AC' ? 'type-badge-ac' : ''}`}>
                          {charger.chargerType || "DC"}
                        </span>
                      </td>
                      <td className="table-td">₹{charger.rate || "8.50"}</td>
                      <td className="table-td">
                        <span className={`charge-mode-badge ${isFast ? 'mode-fast' : 'mode-standard'}`}>
                          {charger.chargeMode || 'Standard'}
                        </span>
                      </td>
                      <td className="table-td">
                        <span className="badge-available">{charger.isOccupied ? 'Occupied' : 'Available'}</span>
                      </td>
                      <td className="table-td">
                        <span className={`status-badge ${charger.availability ? 'badge-online' : 'badge-offline'}`}>
                          {charger.availability ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="table-td">
                        <div className="action-icons">
                          <button className="icon-btn"><img src={editIcon} alt="Edit" style={{ width: "16px" }} /></button>
                          <button className="icon-btn"><img src={deleteIcon} alt="Del" style={{ width: "14px" }} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {isModelOpen && (
          <Model onClose={() => setIsModelOpen(false)}>
            <Suspense fallback={<LoadingSpinner />}>
              <AddCharger
                onClose={() => setIsModelOpen(false)}
                onChargerAdded={handleChargerAdded}
                baseUrl={baseUrl}
              />
            </Suspense>
          </Model>
        )}
      </div>
    </>
  );
};

export default Charger;
