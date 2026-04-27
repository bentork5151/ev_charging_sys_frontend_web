import React, { useState } from "react";

const AddStaffForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "ADMIN"
  });
  const [loading, setLoading] = useState(false);
  const baseUrl = "/api";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${baseUrl}/admin/signup`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Admin registered successfully!");
        onClose();
      } else {
        const errorData = await response.text();
        throw new Error(errorData || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "24px",
        padding: "32px",
        width: "500px",
        maxWidth: "95%",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        fontFamily: "Lexend, sans-serif"
      }}
    >
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Register</h2>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>Add a new administrator or dealer to the system</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
          style={{ padding: "12px 16px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "14px", outline: "none" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
          style={{ padding: "12px 16px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "14px", outline: "none" }}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          required
          value={formData.mobile}
          onChange={handleChange}
          style={{ padding: "12px 16px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "14px", outline: "none" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          style={{ padding: "12px 16px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "14px", outline: "none" }}
        />

        <div style={{ marginTop: "8px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#111", display: "block", marginBottom: "8px" }}>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "14px", background: "#fff", outline: "none" }}
          >
            <option value="ADMIN">Administrator</option>
            <option value="DEALER">Dealer</option>
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "10px 24px", borderRadius: "30px", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: "600" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "10px 24px", borderRadius: "30px", border: "none", background: "#1E1E1E", color: "#fff", cursor: "pointer", fontWeight: "600" }}
          >
            {loading ? "Registering..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaffForm;

