import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "../../components/admin/topbar";
import Sidebar from "../../components/admin/Sidebar";

// import Card from "../../components/card/card.jsx";
import LogoutModal from "../../components/admin/LogoutModal";
import totalIcon from "../../assets/icons/stafficon/blue.svg";
import adminIcon from "../../assets/icons/stafficon/toatl.svg";
import managerIcon from "../../assets/icons/stafficon/yellow.svg";
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

  // Static dashboard stats
 const cards = [
     { title: "Total Users ", value: "13,530",value1: "+23 from last month", icon: VectorIcon },
     { title: "Total Revenue ", value: "₹1,98,530",value1: "+23 from last month", icon: VectorIcon },
     { title: "Sessions", value: "8,209",value1: "+23 from last month", icon: VectorIcon },
     { title: "Units Consumed", value: "23.4kW",value1: "+23 from last month", icon: VectorIcon },
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
    if (item.name === "Log Out") {
      setShowLogout(true);
    } else if (item.path) {
      navigate(item.path);
    }
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
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {/* {stats.map((stat, i) => (
                      <Card key={i} {...stat} />
                    ))} */}


 {/* cards css  */}
                    <>
      <style>
        {`
          .cards-container {
            width: 100%;
            display: flex;
            justify-content: space-between; /* ✅ spread across full width */
            gap: 15px;
          }

          .card-box {
            flex: 1; /* ✅ each card grows equally */
            max-width: 250px; /* prevent too wide */
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 14px;
            
            padding: 18px 40px;
            background-color: white;
            border: 0.2px solid #ddd;
            height: 90px;
            font-family: Roboto, sans-serif;
          }

          .card-title {
            font-size: 12px;
            line-height: 160%;
            font-weight: 400;
          }

          .card-value {
            font-size: 24px;
            line-height: 160%;
            font-weight: 500;
          }
            .card-value1 {
            font-size: 12px;
            
            font-weight: 400;
          }

          .card-icon {
            width: 22px;
            height: 22px;
          }
        `}
      </style>

      <div className="cards-container">
        {cards.map((card, index) => (
          <div className="card-box" key={index}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="card-title">{card.title}</span>
              <span className="card-value">{card.value}</span>
               <span className="card-value1">{card.value1}</span>
            </div>
            <img
              src={card.icon}
              alt={`${card.title} icon`}
              className="card-icon"
            />
          </div>
        ))}
      </div>
    </>
                  </div>
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
