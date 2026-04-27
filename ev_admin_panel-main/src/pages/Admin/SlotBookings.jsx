import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sortIcon from "../../assets/icons/stationicon/upndown.svg";
import deleteIcon from "../../assets/icons/stationicon/delete.svg";

const LoadingSpinner = () => (
    <div style={{ textAlign: "center", padding: "50px", fontSize: "18px", color: "#555" }}>
        Loading data...
    </div>
);

export default function SlotBookings({ baseUrl }) {
    const navigate = useNavigate();
    const [stations, setStations] = useState([]);
    const [selectedStationId, setSelectedStationId] = useState("");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchStations = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            try {
                const res = await fetch(`${baseUrl}/stations/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setStations(data);
                if (data.length > 0) {
                    setSelectedStationId(data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch stations:", err);
            }
        };
        fetchStations();
    }, [baseUrl, navigate]);

    useEffect(() => {
        if (!selectedStationId) return;

        const fetchBookings = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${baseUrl}/slot-bookings/station/${selectedStationId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setBookings(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [selectedStationId, baseUrl, refreshKey]);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${baseUrl}/slot-bookings/${bookingId}/cancel`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Booking cancelled successfully.");
                setRefreshKey(prev => prev + 1);
            } else {
                const err = await res.text();
                alert(`Failed to cancel booking: ${err}`);
            }
        } catch (err) {
            console.error("Error cancelling booking:", err);
        }
    };

    const filteredBookings = bookings.filter(b => {
        const idStr = (b.id || b._id || "").toString();
        const userStr = (b.user_id || b.userId || b.User_id || "").toString();
        return idStr.includes(searchTerm) || userStr.includes(searchTerm);
    });

    return (
        <div style={{ padding: "30px", fontFamily: "Lexend, sans-serif", backgroundColor: "#F1F1F1", minHeight: "100vh" }}>
            <style>
                {`
          .station-select {
            padding: 10px 16px;
            border-radius: 20px;
            border: 1px solid #ddd;
            font-family: 'Lexend', sans-serif;
            font-size: 14px;
            min-width: 250px;
            outline: none;
            background-color: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .bookings-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 12px;
            margin-top: 20px;
          }
          .table-th {
            text-align: left;
            padding: 12px;
            font-size: 13px;
            font-weight: 600;
            color: #444;
          }
          .table-tr {
            background-color: white;
            transition: box-shadow 0.2s;
          }
          .table-tr:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .table-td {
            padding: 16px 12px;
            font-size: 14px;
            color: #333;
          }
          .table-td:first-child { border-radius: 12px 0 0 12px; }
          .table-td:last-child { border-radius: 0 12px 12px 0; }
          .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          .status-booked { background-color: #D1FAE5; color: #065F46; }
          .status-cancelled { background-color: #FFE4E6; color: #BE123C; }
          .status-completed { background-color: #DBEAFE; color: #1E40AF; }
          .search-input {
            padding: 10px 16px;
            border-radius: 20px;
            border: 1px solid #ddd;
            width: 300px;
            outline: none;
            font-family: 'Lexend', sans-serif;
            font-size: 14px;
          }
        `}
            </style>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h2 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>Slot Bookings</h2>
                    <p style={{ color: "#666", marginTop: "4px" }}>Manage and monitor user slot reservations</p>
                </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "30px", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>Station:</span>
                    <select
                        className="station-select"
                        value={selectedStationId}
                        onChange={(e) => setSelectedStationId(e.target.value)}
                    >
                        {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                <div style={{ flex: 1 }}></div>

                <input
                    type="text"
                    placeholder="Search by ID or User ID"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                {loading ? (
                    <LoadingSpinner />
                ) : filteredBookings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>No bookings found.</div>
                ) : (
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                {["ID", "Booking Time", "Status", "Charger ID", "Slot ID", "Station ID", "User ID", "Action"].map((h, i) => (
                                    <th key={i} className="table-th">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((b) => (
                                <tr key={b.id || b._id} className="table-tr">
                                    <td className="table-td"># {b.id || b._id}</td>
                                    <td className="table-td">{b.booking_time || (b.bookingDate ? `${b.bookingDate} ` : "") + (b.startTime ? `${b.startTime} - ${b.endTime}` : "N/A")}</td>
                                    <td className="table-td">
                                        <span className={`status-badge status-${(b.status || 'booked').toLowerCase()}`}>
                                            {b.status || "BOOKED"}
                                        </span>
                                    </td>
                                    <td className="table-td">{b.charger_id || b.chargerId || "N/A"}</td>
                                    <td className="table-td">{b.slot_id || b.slotId || "N/A"}</td>
                                    <td className="table-td">{b.station_id || b.stationId || selectedStationId || "N/A"}</td>
                                    <td className="table-td">{b.user_id || b.userId || b.User_id || "N/A"}</td>
                                    <td className="table-td">
                                        {b.status?.toUpperCase() !== "CANCELLED" && b.status?.toUpperCase() !== "COMPLETED" && (
                                            <button
                                                onClick={() => handleCancelBooking(b.id || b._id)}
                                                style={{ border: "none", background: "none", cursor: "pointer", color: "#BE123C", fontWeight: "600", fontSize: "13px" }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
