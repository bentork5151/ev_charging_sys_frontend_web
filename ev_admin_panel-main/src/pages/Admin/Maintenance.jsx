import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const data = [
  { name: "Mon", cases: 4 },
  { name: "Tue", cases: 3 },
  { name: "Wed", cases: 2 },
  { name: "Thu", cases: 5 },
  { name: "Fri", cases: 6 },
  { name: "Sat", cases: 4 },
  { name: "Sun", cases: 3 },
];

export default function MaintenanceDashboard({ baseUrl: propBaseUrl }) {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: ""
  });

  const baseUrl = propBaseUrl || "/api";

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${baseUrl}/emergency-contacts/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setContacts(result);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        name: contact.name || "",
        contactNumber: contact.contactNumber || contact.contact_number || contact.phone || ""
      });
    } else {
      setEditingContact(null);
      setFormData({
        name: "",
        contactNumber: ""
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${baseUrl}/emergency-contacts/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchContacts();
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = editingContact
      ? `${baseUrl}/emergency-contacts/update/${editingContact.id}`
      : `${baseUrl}/emergency-contacts/add`;
    const method = editingContact ? "PUT" : "POST";

    const payload = {
      name: formData.name,
      contactNumber: formData.contactNumber,
      contact_number: formData.contactNumber,
      phone: formData.contactNumber
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert(editingContact ? "Contact updated successfully!" : "Contact added successfully!");
        setShowModal(false);
        fetchContacts();
      } else {
        const errorText = await response.text();
        console.error("Failed API details:", response.status, errorText);
        // Show clearer error string without failing to alert missing items
        alert(`Failed to save contact: Backend responded with ${response.status}\nMessage: ${errorText}`);
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      alert(`Error saving contact: ${error.message}`);
    }
  };

  return (
    <>
      <style>{`
        .dashboard-container {
          width: 100%;
          background: #f1f1f1;
          min-height: 100vh;
          padding: 24px;
          box-sizing: border-box;
          font-family: 'Lexend', sans-serif;
        }

        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .header-left h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
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
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #e0e0e0;
        }

        .maint-btn {
          padding: 10px 20px;
          background: #111;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #eee;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 120px;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #111;
          margin-top: 8px;
        }

        .graph-container {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #eee;
          margin-bottom: 24px;
        }

        .graph-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .records-section {
          background: #fff;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid #eee;
        }

        .records-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .records-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .records-table th {
          text-align: left;
          padding: 12px 16px;
          color: #666;
          font-weight: 500;
          font-size: 13px;
          border-bottom: 1px solid #f0f0f0;
        }

        .records-table td {
          padding: 16px;
          font-size: 14px;
          color: #333;
          border-bottom: 1px solid #f0f0f0;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          background: #ffe5ea;
          color: #ff3b5c;
        }

        .action-btn {
          padding: 6px 14px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #f5f5f5;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #fff;
          padding: 32px;
          border-radius: 16px;
          width: 500px;
          max-width: 90%;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          color: #333;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .switch-maint-container {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 100;
        }

        .switch-maint-btn {
          background: #111;
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }

        .switch-maint-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="dashboard-container">
        <div className="top-header">
          <div className="header-left">
            <h2>Emergency & Maintenance</h2>
          </div>

        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Active Cases <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></span>
            <span className="stat-value">14</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Scheduled Today <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></span>
            <span className="stat-value">1</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">In Progress <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></svg></span>
            <span className="stat-value">1</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completed This Week <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg></span>
            <span className="stat-value">3</span>
          </div>
        </div>

        <div className="graph-container">
          <div className="graph-header">
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>Graphical Overview</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#666' }}>Real-time monitoring data</p>
            </div>
            <div className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="cases" stroke="#8884d8" fillOpacity={1} fill="url(#colorCases)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="records-section">
          <div className="records-header">
            <h3 style={{ margin: 0, fontSize: 18 }}>Emergency Contacts</h3>
            <button className="maint-btn" onClick={() => handleOpenModal()}>Add Contact</button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Loading contacts...</div>
          ) : (
            <table className="records-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact Number</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length > 0 ? contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>#{contact.id}</td>
                    <td>{contact.name}</td>
                    <td>{contact.contactNumber}</td>
                    <td><span className="status-badge">Active</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="action-btn" onClick={() => handleOpenModal(contact)}>Edit</button>
                        <button className="action-btn" style={{ color: '#ff3b5c' }} onClick={() => handleDelete(contact.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No contacts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{editingContact ? "Edit Contact" : "Add Emergency Contact"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="action-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="maint-btn">Save Contact</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="switch-maint-container">
          <button
            className="switch-maint-btn"
            onClick={() => navigate("/dashboard/maintenance-dashboard")}
          >
            Switch to Maintenance
          </button>
        </div>
      </div>
    </>
  );
}
