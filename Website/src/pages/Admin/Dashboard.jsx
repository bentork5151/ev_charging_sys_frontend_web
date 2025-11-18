import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Components
import Topbar from "../../components/admin/topbar";
import Sidebar from "../../components/admin/Sidebar";
import LogoutModal from "../../components/admin/LogoutModal";
import OverviewChart from "../../components/admin/OverviewChart";

// Icons
import VectorIcon from "../../assets/icons/stafficon/Vector-3.svg";

// Lazy-Loaded Pages (Major Bundle Size Optimization)
const Stations = lazy(() => import("./Stations"));
const Charger = lazy(() => import("./Charger"));
const Sessions = lazy(() => import("./Sessions"));
const Slot = lazy(() => import("./Slot"));
const Users = lazy(() => import("./Users"));
const Plans = lazy(() => import("./Plans"));
const Revenue = lazy(() => import("./Revenue"));
const Maintenance = lazy(() => import("./Maintenance"));
const AdminStaff = lazy(() => import("./AdminStaff"));

const LoadingSpinner = () => (
  <div style={{ textAlign: "center", padding: "40px", fontSize: "16px" }}>
    Loading...
  </div>
);

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const baseUrl = "http://localhost:8080/api";

  const [dashboardCards, setDashboardCards] = useState([
    { title: "Total Users", value: "...", value1: "Fetching...", icon: VectorIcon },
    { title: "Total Revenue", value: "...", value1: "Fetching...", icon: VectorIcon },
    { title: "Sessions", value: "...", value1: "Fetching...", icon: VectorIcon },
    { title: "Units Consumed", value: "...", value1: "Fetching...", icon: VectorIcon },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const endpoints = [
          "/users/total",
          "/revenue/total",
          "/sessions/total",
          "/sessions/energy",
        ];

        const responses = await Promise.all(
          endpoints.map((ep) => fetch(baseUrl + ep, { headers }))
        );

        if (responses.some((res) => res.status === 401))
          return navigate("/login");

        const [u, r, s, e] = await Promise.all(responses.map((r) => r.text()));

        setDashboardCards([
          { title: "Total Users", value: Number(u).toLocaleString("en-IN"), value1: "+23 last month", icon: VectorIcon },
          { title: "Total Revenue", value: `₹${Number(r).toLocaleString("en-IN")}`, value1: "+23 last month", icon: VectorIcon },
          { title: "Sessions", value: Number(s).toLocaleString("en-IN"), value1: "+23 last month", icon: VectorIcon },
          { title: "Units Consumed", value: `${e} kW`, value1: "+23 last month", icon: VectorIcon },
        ]);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
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

  const handleMenuClick = (item) => {
    if (item.name === "Log Out") return setShowLogout(true);
    if (item.path) navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogout(false);
    onLogout?.();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Lexend, sans-serif" }}>
      
      <Topbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={() => setShowLogout(true)}
      />

      {/* Body */}
      <div style={{ flex: 1, display: "flex" }}>

        {/* Sidebar */}
        <div
          style={{
            width: isSidebarOpen ? "250px" : "0px",
            transition: "width 0.25s ease",
            overflow: "hidden",
          }}
        >
          <Sidebar menuItems={menuItems} onItemClick={handleMenuClick} />
        </div>

        {/* Main Content */}
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
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Dashboard Page */}
              <Route
                index
                element={
                  <div>
                    <h1 className="text-2xl mb-4">Dashboard</h1>

                    {/* Cards */}
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                      {dashboardCards.map((card, i) => (
                        <div
                          key={i}
                          style={{
                            flex: "1",
                            minWidth: "220px",
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "18px 24px",
                            background: "white",
                            borderRadius: "14px",
                            border: "1px solid #e5e5e5",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "12px" }}>{card.title}</div>
                            <div style={{ fontSize: "24px", fontWeight: 500 }}>{card.value}</div>
                            <div style={{ fontSize: "12px", opacity: 0.7 }}>{card.value1}</div>
                          </div>

                          <img src={card.icon} alt="icon" width={22} />
                        </div>
                      ))}
                    </div>

                    {/* Chart */}
                    <OverviewChart />
                  </div>
                }
              />

              {/* Lazy-loaded pages */}
              <Route path="stations" element={<Stations baseUrl={baseUrl} />} />
              <Route path="charger" element={<Charger />} />
              <Route path="sessions" element={<Sessions baseUrl={baseUrl} />} />
              <Route path="slot" element={<Slot />} />
              <Route path="users" element={<Users baseUrl={baseUrl} />} />
              <Route path="plans" element={<Plans />} />
              <Route path="revenue" element={<Revenue baseUrl={baseUrl} />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="staff" element={<AdminStaff />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} onConfirm={handleLogout} />}
    </div>
  );
}
