import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "../../components/admin/topbar";
import Sidebar from "../../components/admin/Sidebar";
import OverviewChart from "../../components/admin/OverviewChart";
import LogoutModal from "../../components/admin/LogoutModal";
import VectorIcon from "../../assets/icons/stafficon/Vector-3.svg";
import StationIcon from "../../assets/icons/station.svg";


// Pages
const Stations = React.lazy(() => import("./Stations"));
const Charger = React.lazy(() => import("./Charger"));
const Sessions = React.lazy(() => import("./Sessions"));
const Slot = React.lazy(() => import("./Slot"));
const Users = React.lazy(() => import("./Users"));
const Plans = React.lazy(() => import("./Plans"));
const Revenue = React.lazy(() => import("./Revenue"));
const Maintenance = React.lazy(() => import("./Maintenance"));
const MaintenanceDashboardPage = React.lazy(() => import("./MaintenanceDashboard"));
const AdminStaff = React.lazy(() => import("./AdminStaff"));
const SlotBookings = React.lazy(() => import("./SlotBookings"));

const LoadingSpinner = () => (
  <div className="loading-spinner">
    Loading data...
  </div>
);

export default function Dashboard({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const baseUrl = "/api";

  const [dashboardCards, setDashboardCards] = useState([
    { title: "Total Users", value: "...", value1: "Fetching data...", icon: VectorIcon },
    { title: "Total Revenue", value: "...", value1: "Fetching data...", icon: VectorIcon },
    { title: "Sessions", value: "...", value1: "Fetching data...", icon: VectorIcon },
    { title: "Stations", value: "...", value1: "Fetching data...", icon: StationIcon },
    { title: "Units Consumed", value: "...", value1: "Fetching data...", icon: VectorIcon },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

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
        users: "/users/total",
        revenue: "/revenue/total",
        sessions: "/sessions/total",
        stations: "/stations/total",
        energy: "/sessions/energy",
      };

      const fetchCardData = async (type, index, transform = (v) => v) => {
        try {
          const res = await fetch(baseUrl + endpoints[type], { headers });
          if (res.status === 401 || res.status === 403) {
            throw new Error('Authentication failed');
          }
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const text = await res.text();
          const val = transform(text);

          setDashboardCards(prev => {
            const newCards = [...prev];
            newCards[index] = {
              ...newCards[index],
              value: val,
              value1: "+23 from last month" // Mocked as per original code
            };
            return newCards;
          });
        } catch (error) {
          console.error(`Failed to fetch ${type}:`, error);
          if (error.message === 'Authentication failed') {
            localStorage.removeItem("token");
            navigate("/");
          }
          setDashboardCards(prev => {
            const newCards = [...prev];
            newCards[index] = { ...newCards[index], value: "Error", value1: "Failed to load" };
            return newCards;
          });
        }
      };

      // Fetch all cards independently
      fetchCardData("users", 0, (v) => parseInt(v).toLocaleString('en-IN'));
      fetchCardData("revenue", 1, (v) => `₹${parseInt(v).toLocaleString('en-IN')}`);
      fetchCardData("sessions", 2, (v) => parseInt(v).toLocaleString('en-IN'));
      fetchCardData("stations", 3, (v) => parseInt(v).toLocaleString('en-IN'));
      fetchCardData("energy", 4, (v) => `${v}kW`);

      setLoading(false);
    };

    fetchDashboardData();
  }, [navigate]);

  const menuItems = [
    { name: "Dashboard", path: "" },
    { name: "Stations & Locations", path: "stations" },
    { name: "Charger & QR Management", path: "charger" },
    { name: "Sessions / Bookings", path: "sessions" },
    { name: "Slot Management", path: "slot" },
    { name: "Slot Bookings", path: "slot-bookings" },
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
    <div className="dashboard-container">
      <style>
        {`
            .loading-spinner {
                text-align: center;
                padding: 50px;
                font-size: 18px;
                color: #555;
            }
            .dashboard-container {
                display: flex;
                flex-direction: column;
                height: 100vh;
                font-family: 'Lexend', sans-serif;
            }
            .content-wrapper {
                flex: 1;
                display: flex;
            }
            .sidebar-wrapper {
                transition: width 0.3s;
                overflow: hidden;
            }
            .sidebar-open {
                width: 250px;
            }
            .sidebar-closed {
                width: 0px;
            }
            .main-content {
                flex: 1;
                padding: 20px;
                margin: 10px;
                border-top-left-radius: 28px;
                background: #F1F1F1;
                overflow-y: auto;
            }
            .page-title {
                font-size: 24px; /* text-2xl */
                margin-bottom: 16px; /* mb-4 */
                font-weight: 500;
            }
            .cards-container {
                display: flex;
                gap: 15px;
            }
            .card-box {
                flex: 1;
                max-width: 250px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 14px;
                padding: 18px 40px;
                background-color: white;
                border: 0.2px solid #ddd;
                height: 90px;
            }
            .card-content {
                display: flex;
                flex-direction: column;
            }
            .card-title {
                font-size: 12px;
                font-weight: 400;
            }
            .card-value {
                font-size: 24px;
                font-weight: 500;
            }
            .card-subtext {
                font-size: 12px;
                font-weight: 400;
            }
            .card-icon {
                width: 22px;
                height: 22px;
            }
            .overview-map-section {
                display: flex;
                gap: 20px;
            }
            .overview-chart-container {
                flex: 2;
            }
            .map-container {
                flex: 1;
                background-color: white;
                border-radius: 16px;
                padding: 24px;
                margin-top: 20px;
                border: 1px solid #e5e7eb;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }
            .map-title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 12px;
            }
            .map-description {
                color: #6b7280;
                font-size: 14px;
            }
            `}
      </style>
      <Topbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={() => setShowLogout(true)}
      />

      <div className="content-wrapper">
        <div className={`sidebar-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Sidebar menuItems={menuItems} onItemClick={handleClick} />
        </div>

        <main className="main-content">
          <React.Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route
                index
                element={
                  <div>
                    <h1 className="page-title">Dashboard</h1>

                    {/* Cards Section */}
                    <div className="cards-container">
                      {dashboardCards.map((card, index) => (
                        <div
                          key={index}
                          className="card-box"
                        >
                          <div className="card-content">
                            <span className="card-title">{card.title}</span>
                            <span className="card-value">{card.value}</span>
                            <span className="card-subtext">{card.value1}</span>
                          </div>
                          <img src={card.icon} alt={card.title} className="card-icon" />
                        </div>
                      ))}
                    </div>

                    {/* Overview Chart & Map Section */}
                    <div className="overview-map-section">
                      <div className="overview-chart-container">
                        <OverviewChart
                          users={dashboardCards[0]?.value}
                          revenue={dashboardCards[1]?.value}
                          sessions={dashboardCards[2]?.value}
                          energy={dashboardCards[4]?.value}
                        />
                      </div>
                      <div className="map-container">
                        <h3 className="map-title">
                          Map goes here
                        </h3>
                        <p className="map-description">
                          Map shows status of the stations like, Active, Idle, Offline/Faulty, etc with unique icons
                        </p>
                      </div>
                    </div>


                  </div>
                }
              />
              <Route path="stations" element={<Stations baseUrl={baseUrl} />} />
              <Route path="charger" element={<Charger baseUrl={baseUrl} />} />
              <Route path="sessions" element={<Sessions baseUrl={baseUrl} />} />
              <Route path="slot" element={<Slot baseUrl={baseUrl} />} />
              <Route path="slot-bookings" element={<SlotBookings baseUrl={baseUrl} />} />
              <Route path="users" element={<Users baseUrl={baseUrl} />} />
              <Route path="plans" element={<Plans baseUrl={baseUrl} />} />
              <Route path="revenue" element={<Revenue baseUrl={baseUrl} />} />
              <Route path="maintenance" element={<Maintenance baseUrl={baseUrl} />} />
              <Route path="maintenance-dashboard" element={<MaintenanceDashboardPage />} />

              <Route path="staff" element={<AdminStaff baseUrl={baseUrl} />} />
            </Routes>
          </React.Suspense>


        </main>
      </div>

      {showLogout && (
        <LogoutModal onClose={() => setShowLogout(false)} onConfirm={handleLogout} />
      )}
    </div>
  );
}
