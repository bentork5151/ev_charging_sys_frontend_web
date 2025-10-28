import React, { useState } from "react";
import StaffSummaryCards from "../../components/card/StaffSummaryCards";
import plusIcon from "../../assets/icons/stafficon/plus.svg";
import editIcon from "../../assets/icons/stafficon/edit.svg";
import deleteIcon from "../../assets/icons/stafficon/delete.png";
import AddStaffForm from "./form/AddStaffForm"; 
import StaffEditForm from "./form/staffedit"; // ✅ Import StaffEditForm

const AdminStaff = () => {
  const [isFormOpen, setIsFormOpen] = useState(null); // ✅ can be "add" or "edit"

  // ✅ Staff Data in State (so we can delete/edit)
  const [staffData, setStaffData] = useState([
    {
      id: 1,
      name: "User Name",
      email: "jane@xyz.com",
      role: "Admin",
      roleColor: "#FECACA",
      status: "Active",
      lastLogin: "2024-01-15 14:30",
    },
    {
      id: 2,
      name: "User Name",
      email: "jane@xyz.com",
      role: "Employee",
      roleColor: "#E5E7EB",
      status: "Inactive",
      lastLogin: "2024-01-15 14:30",
    },
    {
      id: 3,
      name: "User Name",
      email: "jane@xyz.com",
      role: "Manager",
      roleColor: "#BFDBFE",
      status: "Active",
      lastLogin: "2024-01-15 14:30",
    },
    {
      id: 4,
      name: "User Name",
      email: "jane@xyz.com",
      role: "Employee",
      roleColor: "#E5E7EB",
      status: "Active",
      lastLogin: "2024-01-15 14:30",
    },
  ]);

  // ✅ Delete function
  const handleDelete = (id) => {
    setStaffData((prev) => prev.filter((staff) => staff.id !== id));
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        fontFamily: "Roboto, sans-serif",
        background: "var(--Default-Background, #F1F1F1)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        {/* ✅ Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              fontFamily: "Lexend, sans-serif",
              margin: 0,
            }}
          >
            Staff Management
          </h2>

          {/* ✅ Add Staff Button */}
          <button
            style={{
              width: "154px",
              height: "48px",
              borderRadius: "18px",
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#1E1E1E", // Black
              color: "#fff",
              fontFamily: "Roboto, sans-serif",
              fontWeight: 600,
              fontSize: "12px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setIsFormOpen("add")}
          >
            <img
              src={plusIcon}
              alt="Add"
              style={{ width: "24px", height: "24px" }}
            />
            <span>Add Staff</span>
          </button>
        </div>

        <p
          style={{
            fontSize: "14px",
            color: "#4B5563",
            marginBottom: "32px",
          }}
        >
          Manage staff & their roles
        </p>

        {/* ✅ Cards Section */}
        <StaffSummaryCards />

        {/* ✅ Staff Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            marginTop: "32px",
            padding: "24px",
            fontFamily: "Lexend, sans-serif", // ✅ Outer Lexend
          }}
        >
          <h3 style={{ marginBottom: "16px", fontWeight: "bold" }}>
            Staff Directory
          </h3>
          <p
            style={{
              marginBottom: "16px",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            View and manage staff members and their permissions
          </p>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search"
            style={{
              width: "95%",
              padding: "12px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              marginBottom: "16px",
              outline: "none",
              fontFamily: "Inter, sans-serif", // ✅ Inner Inter
            }}
          />

          {/* Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead style={{ fontFamily: "Inter, sans-serif" }}>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                <th style={{ padding: "12px" }}>Name</th>
                <th style={{ padding: "12px" }}>Role</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Last Login</th>
                <th style={{ padding: "12px" }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ fontFamily: "Inter, sans-serif" }}>
              {staffData.map((staff) => (
                <tr
                  key={staff.id}
                  style={{ borderBottom: "1px solid #F3F4F6" }}
                >
                  <td style={{ padding: "12px" }}>
                    <div
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <span style={{ fontWeight: 500 }}>{staff.name}</span>
                      <span
                        style={{ fontSize: "12px", color: "#6B7280" }}
                      >
                        {staff.email}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        background: staff.roleColor,
                        padding: "7px 14px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {staff.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>{staff.status}</td>
                  <td style={{ padding: "12px" }}>{staff.lastLogin}</td>
                  <td
                    style={{
                      padding: "12px",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                      onClick={() => setIsFormOpen("edit")} // ✅ Edit opens StaffEditForm
                    >
                      <img
                        src={editIcon}
                        alt="Edit"
                        style={{
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                      onClick={() => handleDelete(staff.id)} // ✅ Delete action
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Modal */}
        {isFormOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
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

export default AdminStaff;
