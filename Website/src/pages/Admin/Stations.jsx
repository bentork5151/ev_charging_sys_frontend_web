import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddStation from "./form/AddStation";

import activeIcon from "../../assets/icons/stationicon/green.svg";
import uptimeIcon from "../../assets/icons/stationicon/yellow.svg";
import errorIcon from "../../assets/icons/stationicon/red.svg";
import sortIcon from "../../assets/icons/stationicon/upndown.svg";
import editIcon from "../../assets/icons/stationicon/edit.svg";
import deleteIcon from "../../assets/icons/stationicon/delete.svg";
import StationOverviewChart from "../../components/admin/StationOverviewChart";

const LoadingSpinner = () => (
  <div style={{ textAlign: "center", padding: "50px", fontSize: "18px", color: "#555" }}>
    Loading data...
  </div>
);

const Modal = ({ children }) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '16px',
      width: '90%',
      height: '90%',
      maxWidth: '1200px',
      maxHeight: '800px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {children}
    </div>
  </div>
);

function Stations({ baseUrl }) {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalStations: "...",
    activeStations: "...",
    averageUptime: "...",
    errorToday: "...",
  });

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchStationData = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const endpoints = {
        total: "/stations/total",
        active: "/stations/active",
        uptime: "/stations/uptime",
        errors: "/stations/error/today",
        records: "/stations/all",
      };

      try {
        const requests = Object.values(endpoints).map((endpoint) =>
          fetch(baseUrl + endpoint, { headers })
        );

        const [
          totalRes,
          activeRes,
          uptimeRes,
          errorsRes,
          recordsRes,
        ] = await Promise.all(requests);

        const failed = [totalRes, activeRes, uptimeRes, errorsRes, recordsRes].find(
          (res) => !res.ok
        );

        if (failed) throw new Error("Network request failed.");

        const [
          totalStations,
          activeStations,
          averageUptime,
          errorToday,
          stationRecords,
        ] = await Promise.all([
          totalRes.text(),
          activeRes.text(),
          uptimeRes.text(),
          errorsRes.text(),
          recordsRes.json(),
        ]);

        setSummaryData({
          totalStations,
          activeStations,
          averageUptime: `${parseFloat(averageUptime)}%`,
          errorToday,
        });

        setStations(stationRecords);
      } catch (error) {
        console.error(error);
        setSummaryData({
          totalStations: "Error",
          activeStations: "Error",
          averageUptime: "Error",
          errorToday: "Error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStationData();
  }, [baseUrl, navigate, refreshKey]);

  const handleStationAdded = () => {
    setIsModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Lexend, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "32px", fontWeight: 700 }}>Station Management</h2>

        <button
          style={{
            width: "160px",
            height: "45px",
            borderRadius: "16px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Add Station
        </button>
      </div>

      {isModalOpen && (
        <Modal>
          <AddStation
            onClose={() => setIsModalOpen(false)}
            onStationAdded={handleStationAdded}
            baseUrl={baseUrl}
          />
        </Modal>
      )}

      {/* Summary Cards */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", maxWidth: "1106px", width: "100%" }}>
          <Card title="Total Stations" value={summaryData.totalStations} icon={activeIcon} />
          <Card title="Active Stations" value={summaryData.activeStations} icon={activeIcon} />
          <Card title="Average Uptime" value={summaryData.averageUptime} icon={uptimeIcon} />
          <Card title="Error Today" value={summaryData.errorToday} icon={errorIcon} />
        </div>
      </div>

      <StationOverviewChart />

      {/* Records */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <div
          style={{
            width: "1140px",
            border: "1px solid #ddd",
            borderRadius: "14px",
            padding: "18px",
            backgroundColor: "#fff",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Stations</h3>

          {loading ? (
            <LoadingSpinner />
          ) : stations.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>
              No stations available.
            </p>
          ) : (
            <table style={{ width: "100%", borderSpacing: "0 12px" }}>
              <thead>
                <tr>
                  {["Name", "Location ID", "Status", "Created At", "Direction Link", "Action"].map(
                    (header, i) => (
                      <th
                        key={i}
                        style={{ padding: "10px", fontWeight: 600, textAlign: "left" }}
                      >
                        {header}
                        {header !== "Action" && (
                          <img src={sortIcon} style={{ width: 12, marginLeft: 6 }} />
                        )}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {stations.map((sta) => (
                  <tr key={sta.id} style={{ background: "#fff", borderRadius: "12px" }}>
                    <td style={{ padding: 12 }}>{sta.name}</td>
                    <td style={{ padding: 12 }}>{sta.locationId || "N/A"}</td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          padding: "6px 14px",
                          borderRadius: "14px",
                          fontWeight: 600,
                          fontSize: "12px",
                          backgroundColor:
                            sta.status === "ACTIVE"
                              ? "#C8E6C9"
                              : sta.status === "COMPLETED"
                              ? "#BBDEFB"
                              : "#FFCDD2",
                          color:
                            sta.status === "ACTIVE"
                              ? "#2E7D32"
                              : sta.status === "COMPLETED"
                              ? "#1976D2"
                              : "#D32F2F",
                        }}
                      >
                        {sta.status}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      {new Date(sta.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: 12 }}>
                      <a href={sta.directionLink} target="_blank" rel="noreferrer">
                        View Map
                      </a>
                    </td>
                    <td style={{ padding: 12, display: "flex", gap: 12 }}>
                      <img src={editIcon} style={{ width: 16, cursor: "pointer" }} />
                      <img src={deleteIcon} style={{ width: 16, cursor: "pointer" }} />
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
      backgroundColor: "#fff",
      borderRadius: "14px",
      padding: "18px 22px",
      border: "1px solid #ddd",
    }}
  >
    <img src={icon} alt="icon" style={{ width: 32 }} />
    <div>
      <p style={{ fontSize: "14px", color: "#555" }}>{title}</p>
      <h3 style={{ fontSize: "22px", fontWeight: 700 }}>{value}</h3>
    </div>
  </div>
);

export default Stations;
