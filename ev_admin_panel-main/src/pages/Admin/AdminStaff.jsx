import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffSummaryCards from "../../components/card/StaffSummaryCards";
import editIcon from "../../assets/icons/stafficon/edit.svg";
import AddStaffForm from "./form/AddStaffForm";
import StaffEditForm from "./form/staffedit";

const LoadingSpinner = () =>
  <div style={{ textAlign: 'center', padding: '50px' }}>
    Loading...
  </div>;

const ErrorDisplay = ({ message }) =>
  <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
    {message}
  </div>;

const roleStyles = {
  Admin: { background: "#D1FAE5", color: "#065F46" },
  Dealer: { background: "#DBEAFE", color: "#1E40AF" },
  DEFAULT: { background: "#F3F4F6", color: "#4B5563" },
};

function AdminStaff({ baseUrl: propBaseUrl }) {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({ admins: 0, dealers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const baseUrl = propBaseUrl || "/api";

  useEffect(() => {
    fetchAllStaffData();
  }, [navigate]);

  const fetchAllStaffData = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const endpoints = {
      totalAdmin: "/admin/total", // 'ADMIN' role
      totalAll: "/admin/all/total", // All admin accounts
      allAdmin: "/admin/alladmin",
    };

    const fetchCount = async (key, endpoint) => {
      try {
        const res = await fetch(baseUrl + endpoint, { headers });
        if (res.status === 401 || res.status === 403) throw new Error('Auth failed');
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const count = await res.text();
        setSummaryStats(prev => {
          const val = parseInt(count) || 0;
          if (key === 'admins') return { ...prev, admins: val };
          // If key is 'all', we calculate dealers as (all - current_admins)
          return { ...prev, dealers: (val - prev.admins) || 0 };
        });
      } catch (err) {
        console.error(`Failed to fetch ${key}:`, err);
        if (err.message === 'Auth failed') {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    const fetchRecords = async () => {
      try {
        const res = await fetch(baseUrl + endpoints.allAdmin, { headers });
        if (res.status === 401 || res.status === 403) throw new Error('Auth failed');
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const records = await res.json();
        setStaffData(Array.isArray(records) ? records : []);
      } catch (err) {
        console.error("Failed to fetch records:", err);
      } finally {
        setLoading(false);
      }
    };

    // Parallel calls
    fetchCount('admins', endpoints.totalAdmin);
    fetchCount('all', endpoints.totalAll);
    fetchRecords();
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm("Are you sure you want to suspend this staff member?")) {
      return;
    }
    // Placeholder for suspend API if available, otherwise using delete logic
    alert("Functionality to suspend user " + staffId + " will be implemented with update-role API.");
  };

  const closeForm = () => {
    setIsFormOpen(null);
    setEditingStaff(null);
    fetchAllStaffData();
  };

  const filteredStaff = staffData.filter(staff =>
    staff.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f1f1f1", position: "relative" }}>
      <style>{`
        .management-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          font-family: 'Lexend', sans-serif;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .header-left h2 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }
        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .icon-btn {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
        }
        .profile-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          padding: 6px 12px;
          border-radius: 24px;
          border: 1px solid #e0e0e0;
        }
        .directory-box {
          background: #fff;
          border-radius: 24px;
          padding: 24px;
          margin-top: 24px;
          border: 1px solid #eee;
        }
        .search-bar {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 12px;
          margin: 20px 0;
          font-size: 14px;
        }
        .staff-table {
          width: 100%;
          border-collapse: collapse;
        }
        .staff-table th {
          text-align: left;
          padding: 12px;
          color: #111;
          font-weight: 600;
          font-size: 14px;
        }
        .staff-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #f9f9f9;
          font-size: 14px;
        }
        .role-pill {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .action-btns {
          display: flex;
          gap: 12px;
        }
        .side-buttons {
          position: fixed;
          bottom: 24px;
          left: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 100;
        }
        .add-btn {
          background: #111;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          width: 160px;
          text-align: center;
        }
      `}</style>

      <div className="management-container">
        <div className="header-row">
          <div className="header-left">
            <h2>Management Console</h2>
          </div>

        </div>

        <StaffSummaryCards stats={{ admins: summaryStats.admins, dealers: summaryStats.dealers }} />

        <div className="directory-box">
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Staff Directory</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>View and manage staff members and their permissions</p>

          <input
            type="text"
            placeholder="Search"
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {loading ? <LoadingSpinner /> : error ? <ErrorDisplay message={error} /> : (
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => {
                  const style = roleStyles[staff.role] || (staff.role?.includes('DEALER') ? roleStyles.Dealer : roleStyles.DEFAULT);
                  return (
                    <tr key={staff.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{staff.name || 'User Name'}</div>
                            <div style={{ fontSize: 11, color: '#999' }}>{staff.email || 'user@xyz.com'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-pill" style={{ background: style.background, color: style.color }}>
                          {staff.role || 'Admin'}
                        </span>
                      </td>
                      <td>{staff.status || 'Active'}</td>
                      <td>{staff.lastLogin ? new Date(staff.lastLogin).toLocaleString() : '2024-01-15 14:30'}</td>
                      <td>
                        <div className="action-btns">
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { setEditingStaff(staff); setIsFormOpen('edit'); }}>
                            <img src={editIcon} alt="Edit" style={{ width: 18 }} />
                          </button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(staff.id)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="side-buttons">
        <button className="add-btn" onClick={() => setIsFormOpen("add")}>Add Dealer</button>
        <button className="add-btn" style={{ background: '#fff', color: '#111', border: '1px solid #ddd' }} onClick={() => setIsFormOpen("add")}>Add Staff</button>
      </div>

      {isFormOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          {isFormOpen === "add" && <AddStaffForm onClose={closeForm} />}
          {isFormOpen === "edit" && <StaffEditForm staff={editingStaff} onClose={closeForm} />}
        </div>
      )}
    </div>
  );
}

export default AdminStaff;
