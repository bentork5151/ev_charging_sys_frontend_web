import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "../../components/admin/topbar";
import Sidebar from "../../components/admin/Sidebar";
import Card from "../../components/card/card.jsx";
import LogoutModal from "../../components/admin/LogoutModal";

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
  const [stats, setStats] = useState([]);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  // Redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found, redirecting to login.");
          navigate("/login", { replace: true });
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Total users
        const usersRes = await fetch("http://localhost:8080/api/users/total", { headers });
        const totalUsers = await usersRes.json();

        // Total sessions
        const sessionsRes = await fetch("http://localhost:8080/api/sessions/total", { headers });
        const totalSessions = await sessionsRes.json();

        // Total energy consumed
        const energyRes = await fetch("http://localhost:8080/api/sessions/energy", { headers });
        const totalEnergy = await energyRes.json();

        // ✅ Fetch total revenue
        let totalRevenue = 0;
        try {
          const revenueRes = await fetch("http://localhost:8080/api/revenue/total", { headers });

          if (revenueRes.ok) {
            const totalText = await revenueRes.json();
            console.log("Revenue API response:", data);

            // Backend may return a number or object
            if (typeof data === "number") {
              totalRevenue = data;
            } else if (data.total != null) {
              totalRevenue = Number(data.total);
            } else {
              console.warn("Unexpected revenue data format:", data);
            }
          } else {
            console.warn("Revenue total endpoint returned", revenueRes.status);
          }
        } catch (err) {
          console.error("Error fetching total revenue:", err);
        }

        // Set dashboard stats
        setStats([
          { title: "Total Users", value: totalUsers, icon: "👤" },
          {
            title: "Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            icon: "💰",
          },
          { title: "Sessions", value: totalSessions, icon: "📊" },
          { title: "Units Consumed", value: `${Number(totalEnergy).toFixed(2)} kWh`, icon: "⚡" },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

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
            fontFamily: "'Lexend', sans-serif",
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
                    {stats.map((stat, i) => (
                      <Card key={i} {...stat} />
                    ))}
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
