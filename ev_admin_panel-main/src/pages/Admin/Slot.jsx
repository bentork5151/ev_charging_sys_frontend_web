import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import iconEdit from "../../assets/icons/edit.png";
import iconDelete from "../../assets/icons/delete.png";
import iconLocation from "../../assets/icons/location.png";
import iconGroup from "../../assets/icons/group.png";
import iconTime from "../../assets/icons/time.png";

const AddSlot = lazy(() => import("./form/AddSlot"));

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

export default function Slot({ baseUrl }) {
  const navigate = useNavigate();
  const [chargers, setChargers] = useState([]);
  const [selectedChargerId, setSelectedChargerId] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchChargers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/chargers/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        const data = await res.json();
        setChargers(data);
        if (data.length > 0) {
          setSelectedChargerId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch chargers:", err);
      }
    };
    fetchChargers();
  }, [baseUrl, navigate]);

  useEffect(() => {
    if (!selectedChargerId) return;

    const fetchSlots = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${baseUrl}/slots/charger/${selectedChargerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSlots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch slots:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedChargerId, baseUrl, refreshKey]);

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseUrl}/slots/${slotId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setRefreshKey(prev => prev + 1);
      } else {
        const err = await res.text();
        alert(`Failed to delete slot: ${err}`);
      }
    } catch (err) {
      console.error("Error deleting slot:", err);
    }
  };

  const handleSlotAdded = () => {
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="slot-container">
      <style>
        {`
          .loading-spinner {
            text-align: center;
            padding: 50px;
            font-size: 18px;
            color: #555;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
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
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            padding: 24px;
          }
          .slot-container {
            font-family: "Lexend", sans-serif;
            background-color: #f5f5f5;
            min-height: 100vh;
            padding: 20px;
          }
          .charger-select {
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #ddd;
            font-family: 'Lexend', sans-serif;
            font-size: 14px;
            min-width: 200px;
            outline: none;
            background-color: white;
          }
          .slot-card {
            background-color: #fff;
            border-radius: 12px;
            padding: 16px;
            flex: 1;
            min-width: 280px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            color: #222;
            font-size: 14px;
            transition: transform 0.2s;
          }
          .slot-card:hover {
            transform: translateY(-2px);
          }
          .slot-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }
          .slot-header h2 {
            margin: 0;
            font-weight: 600;
            color: #111;
            font-size: 28px;
          }
          .slot-header p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
          }
          .btn-add-slot {
            background-color: #000;
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 10px 24px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
          }
          .charger-selection-wrapper {
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .charger-selection-label {
            font-size: 14px;
            font-weight: 500;
            color: #444;
          }
          .no-slots-placeholder {
            text-align: center;
            padding: 40px;
            color: #888;
          }
          .slot-cards-wrapper {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
          }
          .slot-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          .slot-card-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #222;
          }
          .slot-card-actions {
            display: flex;
            gap: 12px;
          }
          .action-icon {
            width: 16px;
            cursor: pointer;
            opacity: 0.7;
          }
          .slot-info-col {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .slot-info-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .info-icon {
            width: 16px;
            opacity: 0.6;
          }
          .time-text {
            font-weight: 500;
          }
          .status-badge {
            font-weight: 600;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 12px;
          }
          .status-booked {
            color: #BE123C;
            background-color: #FFE4E6;
          }
          .status-available {
            color: #065F46;
            background-color: #D1FAE5;
          }
          .date-text {
            font-size: 13px;
            color: #666;
            margin-top: 4px;
          }
          .price-text {
            font-size: 13px;
            color: #333;
            font-weight: 500;
          }
          .overview-container {
            background-color: #fff;
            border-radius: 12px;
            padding: 20px;
            margin-top: 30px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            color: #222;
          }
          .overview-container h4 {
            margin: 0 0 8px 0;
            font-weight: 600;
            font-size: 18px;
          }
          .overview-container p {
            font-size: 14px;
            color: #666;
            margin-bottom: 16px;
          }
          .overview-chart-placeholder {
            height: 200px;
            background-color: #f9f9f9;
            border-radius: 12px;
            border: 1px dashed #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            font-size: 14px;
          }
        `}
      </style>

      {/* Header */}
      <div className="slot-header">
        <div>
          <h2>Slot Management</h2>
          <p>Manage charging slots for chargers across stations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-add-slot"
        >
          + Add Slot
        </button>
      </div>

      {/* Charger Selection */}
      <div className="charger-selection-wrapper">
        <span className="charger-selection-label">Select Charger:</span>
        <select
          className="charger-select"
          value={selectedChargerId}
          onChange={(e) => setSelectedChargerId(e.target.value)}
        >
          {chargers.map(charger => (
            <option key={charger.id} value={charger.id}>
              {charger.ocppId || `Charger ${charger.id}`} ({charger.chargerType})
            </option>
          ))}
        </select>
      </div>

      {/* Slot Cards */}
      {loading ? (
        <LoadingSpinner />
      ) : slots.length === 0 ? (
        <div className="no-slots-placeholder">
          No slots available for this charger.
        </div>
      ) : (
        <div className="slot-cards-wrapper">
          {slots.map((slot) => (
            <div key={slot.id} className="slot-card">
              <div className="slot-card-header">
                <h3>{slot.slotType || "Standard Slot"}</h3>
                <div className="slot-card-actions">
                  <img src={iconEdit} alt="edit" className="action-icon" title="Edit (Coming Soon)" />
                  <img
                    src={iconDelete}
                    alt="delete"
                    className="action-icon"
                    onClick={() => handleDeleteSlot(slot.id)}
                    title="Delete Slot"
                  />
                </div>
              </div>

              <div className="slot-info-col">
                <div className="slot-info-row">
                  <img src={iconTime} alt="time" className="info-icon" />
                  <span className="time-text">{slot.startTime} - {slot.endTime}</span>
                </div>

                <div className="slot-info-row">
                  <img src={iconGroup} alt="status" className="info-icon" />
                  <span className={`status-badge ${slot.isBooked ? 'status-booked' : 'status-available'}`}>
                    {slot.isBooked ? "Booked" : "Available"}
                  </span>
                </div>

                <div className="date-text">
                  Date: {slot.date}
                </div>
                {slot.priceMultiplier && (
                  <div className="price-text">
                    Price Multiplier: {slot.priceMultiplier}x
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Graphical Overview Placeholder */}
      <div className="overview-container">
        <h4>Charger Usage Overview</h4>
        <p>Daily booking trends and availability status</p>
        <div className="overview-chart-placeholder">
          Analytics chart visualization goes here
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <Suspense fallback={<LoadingSpinner />}>
            <AddSlot
              onClose={() => setIsModalOpen(false)}
              onSlotAdded={handleSlotAdded}
              baseUrl={baseUrl}
              chargers={chargers}
              initialChargerId={selectedChargerId}
            />
          </Suspense>
        </Modal>
      )}
    </div>
  );
}
