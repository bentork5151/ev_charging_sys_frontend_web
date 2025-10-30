// export default function Users() {
//   return <h2>Users & RFID Cards</h2>;
// }
import React, { useState } from "react";
import StaffSummaryCards from "../../components/card/StaffSummaryCards";
import plusIcon from "../../assets/icons/stafficon/plus.svg";
import editIcon from "../../assets/icons/stafficon/edit.svg";
import deleteIcon from "../../assets/icons/stafficon/delete.png";
import AddStaffForm from "./form/RegisterCard"; 
import StaffEditForm from "./form/staffedit"; // ✅ Import StaffEditForm
import totalIcon from "../../assets/icons/stafficon/blue.svg";
import adminIcon from "../../assets/icons/stafficon/toatl.svg";
import managerIcon from "../../assets/icons/stafficon/yellow.svg";
import activeIcon from "../../assets/icons/stafficon/red.svg";
const Users = () => {
  const [isFormOpen, setIsFormOpen] = useState(null); // ✅ can be "add" or "edit"
const cards = [
    { title: "Total Cards", value: "123", icon: totalIcon },
    { title: "Active ", value: "1", icon: adminIcon },
    { title: "Inactive Cards", value: "1", icon: managerIcon },
    { title: "Recently Added", value: "3", icon: activeIcon },
  ];
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
            RFID Manager
          </h2>

          {/* ✅ Add RFID Button */}
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
            <span>Register Card</span>
          </button>
        </div>

        <p
          style={{
            fontSize: "14px",
            color: "#4B5563",
            marginBottom: "32px",
          }}
        >
          Manage RFID cards & registration
        </p>

            {/* ✅ Cards Section */}
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
            max-width: 230px; /* prevent too wide */
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
            font-size: 12px;
            line-height: 160%;
            font-weight: 400;
          }

          .card-value {
            font-size: 24px;
            line-height: 160%;
            font-weight: 600;
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
             Directory
          </h3>
          <p
            style={{
              marginBottom: "16px",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            {/* View and manage staff members and their permissions */}
          </p>

          {/* Search Bar */}
          {/* <input
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
          /> */}

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
                <th style={{ padding: "12px" }}>Id</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Registration Date</th>
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

export default Users;
