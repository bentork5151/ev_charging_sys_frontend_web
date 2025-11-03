import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "../../components/admin/topbar";
import Sidebar from "../../components/admin/Sidebar";
import OverviewChart from "../../components/admin/OverviewChart";
import LogoutModal from "../../components/admin/LogoutModal";
import VectorIcon from "../../assets/icons/stafficon/Vector-3.svg";


// Pages
import Stations from "./Stations";
import Charger from "./Charger";
import Sessions from "./Sessions";
import Slot from "./Slot";
import Users from "./Users";
import Plans from "./Plans";
import Revenue from "./Revenue";
import Maintenance from "./Maintenance";
import AdminStaff from "./AdminStaff";

export default function Dashboard({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const cards = [
    { title: "Total Users", value: "13,530", value1: "+23 from last month", icon: VectorIcon },
    { title: "Total Revenue", value: "₹1,98,530", value1: "+23 from last month", icon: VectorIcon },
    { title: "Sessions", value: "8,209", value1: "+23 from last month", icon: VectorIcon },
    { title: "Units Consumed", value: "23.4kW", value1: "+23 from last month", icon: VectorIcon },
  ];

  const menuItems = [
    { name: "Dashboard", path: "" },
    { name: "Stations & Locations", path: "stations" },
    { name: "Charger & QR Management", path: "charger" },
    { name: "Sessions / Bookings", path: "sessions" },
    { name: "Slot Management", path: "slot" },
    { name: "Users & RFID Cards", path: "users" },
    { name: "Plans", path: "plans" },
    { name: "Revenue & Transactions", path: "revenue" },
    { name: "Maintenance & Emergency", path: "maintenance" },
    { name: "Admin Staff", path: "staff" },
    { name: "Log Out", path: null },
  ];

  const handleClick = (item) => {
    if (item.name === "Log Out") setShowLogout(true);
    else if (item.path) navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogout(false);
    if (onLogout) onLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Lexend', sans-serif",
      }}
    >
      <Topbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={() => setShowLogout(true)}
      />

      <div style={{ flex: 1, display: "flex" }}>
        <div
          style={{
            width: isSidebarOpen ? "250px" : "0px",
            transition: "width 0.3s",
            overflow: "hidden",
          }}
        >
          <Sidebar menuItems={menuItems} onItemClick={handleClick} />
        </div>

        <main
          style={{
            flex: 1,
            padding: "20px",
            margin: "10px",
            borderTopLeftRadius: "28px",
            background: "#F1F1F1",
            overflowY: "auto",
          }}
        >
          <Routes>
            <Route
              index
              element={
                <div>
                  <h1 className="text-2xl mb-4">Dashboard</h1>

                  {/* Cards Section */}
                  <div className="cards-container" style={{ display: "flex", gap: "15px" }}>
                    {cards.map((card, index) => (
                      <div
                        key={index}
                        className="card-box"
                        style={{
                          flex: 1,
                          maxWidth: "250px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderRadius: "14px",
                          padding: "18px 40px",
                          backgroundColor: "white",
                          border: "0.2px solid #ddd",
                          height: "90px",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "12px", fontWeight: "400" }}>{card.title}</span>
                          <span style={{ fontSize: "24px", fontWeight: "500" }}>{card.value}</span>
                          <span style={{ fontSize: "12px", fontWeight: "400" }}>{card.value1}</span>
                        </div>
                        <img src={card.icon} alt={card.title} style={{ width: "22px", height: "22px" }} />
                      </div>
                    ))}
                  </div>

                  {/* ✅ Overview Chart Section */}
                  <OverviewChart />
                
                </div>
              }
            />
            <Route path="stations" element={<Stations />} />
            <Route path="charger" element={<Charger />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="slot" element={<Slot />} />
            <Route path="users" element={<Users />} />
            <Route path="plans" element={<Plans />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="staff" element={<AdminStaff />} />
          </Routes>
        </main>
      </div>

      {showLogout && (
        <LogoutModal onClose={() => setShowLogout(false)} onConfirm={handleLogout} />
      )}
    </div>
  );
}
