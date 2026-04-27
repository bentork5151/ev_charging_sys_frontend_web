import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffEditForm from "./form/staffedit"; // ✅ Import StaffEditForm
import VectorIcon from "../../assets/icons/stafficon/Vector-3.svg";
import SessionTable from "../../components/admin/SessionTable";
import SearchBar from "../../components/admin/SearchBar";

const LoadingSpinner = () => 
  <div className="loading-spinner">
    Loading...
  </div>;

const ErrorDisplay = ({ message }) => 
  <div className="error-display">
    {message}
  </div>;

const Users = ({ baseUrl }) => {
  const navigate = useNavigate();
  const [summaryStats, setSummaryStats] = useState({});
  const [revenueRecords, setRevenueRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(null); // ✅ can be "add" or "edit"

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

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
        total: "/revenue/total",
        pending: "/revenue/pending",
        transactions: "/revenue/transactions/total",
        rate: "/revenue/success-rate",
        allRecords: "/revenue/all",
      };

      const fetchSummaryItem = async (key, endpoint) => {
        try {
          const res = await fetch(baseUrl + endpoint, { headers });
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const data = await res.json();
          setSummaryStats(prev => ({ ...prev, [key]: data }));
        } catch (err) {
          console.error(`Failed to fetch ${key}:`, err);
        }
      };

      const fetchRecords = async () => {
        try {
          const res = await fetch(baseUrl + endpoints.allRecords, { headers });
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const data = await res.json();
          setRevenueRecords(data);
        } catch (err) {
          console.error("Failed to fetch records:", err);
        } finally {
          setLoading(false);
        }
      };

      // Start all fetches
      fetchSummaryItem('totalRevenue', endpoints.total);
      fetchSummaryItem('pendingRevenue', endpoints.pending);
      fetchSummaryItem('totalTransactions', endpoints.transactions);
      fetchSummaryItem('successRate', endpoints.rate);
      fetchRecords();
    };
      fetchAllData();
  }, [baseUrl, navigate]);

  const cards = [
      { title: "Total Revenue", value: `₹${summaryStats.totalRevenue?.toLocaleString('en-IN') || '...'}` },
      { title: "Pending Revenue", value: `₹${summaryStats.pendingRevenue?.toLocaleString('en-IN') || '...'}` },
      { title: "Total Transactions", value: summaryStats.totalTransactions || '...' },
      { title: "Success Rate", value: `${summaryStats.successRate || '...'}%` },
    ];

  return (
    <div className="revenue-container">
      <style>
        {`
          .loading-spinner {
            text-align: center;
            padding: 50px;
          }
          .error-display {
            text-align: center;
            padding: 50px;
            color: red;
          }
          .revenue-container {
            width: 100%;
            min-height: 100vh;
            font-family: Roboto, sans-serif;
            background: var(--Default-Background, #F1F1F1);
          }
          .revenue-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
          }
          .revenue-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .revenue-title {
            font-size: 32px;
            font-weight: bold;
            font-family: 'Lexend', sans-serif;
            margin: 0;
          }
          .revenue-subtitle {
            font-size: 14px;
            color: #4B5563;
            margin-bottom: 32px;
          }
          .cards-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            gap: 15px;
          }
          .card-box {
            flex: 1;
            max-width: 230px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 14px;
            padding: 12px 20px;
            background-color: white;
            border: 0.2px solid #ddd;
            height: 90px;
            font-family: Roboto, sans-serif;
          }
          .card-title {
            font-size: 19px;
            line-height: 160%;
            font-weight: 400;
          }
          .card-value {
            font-size: 24px;
            line-height: 160%;
            font-weight: 600;
          }
          .card-value1 {
            font-size: 13px;
            line-height: 50%;
            padding: 12px 20px;
            font-weight: 200;
          }
          .card-icon {
            width: 22px;
            height: 22px;
          }
          .card-content {
            display: flex;
            flex-direction: column;
          }
          .table-container {
            background: #fff;
            border-radius: 12px;
            margin-top: 32px;
            padding: 24px;
            font-family: 'Lexend', sans-serif;
          }
          .table-description {
            margin-bottom: 16px;
            color: #6B7280;
            font-size: 14px;
          }
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
        `}
      </style>

      <div className="revenue-content">
        {/* ✅ Header row */}
        <div className="revenue-header">
          <h2 className="revenue-title">
            Revenue & Transactions
          </h2>
        </div>

        <p className="revenue-subtitle">
          Manage and monitor all revenue transactions
        </p>

        {/* ✅ Cards Section */}
        <div className="cards-container">
          {cards.map((card, index) => (
            <div className="card-box" key={index}>
              <div className="card-content">
                <span className="card-title">{card.title}</span>
                <span className="card-value">{card.value}</span>
                {/* <span className="card-value1">{card.value1}</span> */}
              </div>
              <img
                src={VectorIcon}
                alt={`${card.title} icon`}
                className="card-icon"
              />
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <br /><br />
        <div>
          <SearchBar />
        </div>

        {/* ✅ Staff Table */}
        <div className="table-container">
          <p className="table-description">
            {/* View and manage staff members and their permissions */}
          </p>

          {/* Table */}
          <SessionTable records={revenueRecords} />
        </div>

        {/* ✅ Modal */}
        {isFormOpen && (
          <div className="modal-overlay">
            {isFormOpen === "add" ? (
              <AddStaffForm onClose={() => setIsFormOpen(null)} />
            ) : (
              <StaffEditForm onClose={() => setIsFormOpen(null)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
