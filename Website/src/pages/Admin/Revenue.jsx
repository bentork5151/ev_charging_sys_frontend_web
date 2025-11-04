// export default function Users() {
//   return <h2>Users & RFID Cards</h2>;
// }
import React, { useState } from "react";
import StaffSummaryCards from "../../components/card/StaffSummaryCards";
import plusIcon from "../../assets/icons/stafficon/plus.svg";
import editIcon from "../../assets/icons/stafficon/edit.svg";
import deleteIcon from "../../assets/icons/stafficon/delete.png";
import register from "./form/AddStaffForm"; 
import StaffEditForm from "./form/staffedit"; // ✅ Import StaffEditForm
import totalIcon from "../../assets/icons/stafficon/blue.svg";
import adminIcon from "../../assets/icons/stafficon/toatl.svg";
import VectorIcon from "../../assets/icons/stafficon/Vector-3.svg";
// import managerIcon from "../../assets/icons/stafficon/yellow.svg";
// import activeIcon from "../../assets/icons/stafficon/red.svg";
// import searchbar from "../../assets/icons/stafficon/searchbar.svg";
import SessionTable from "../../components/admin/SessionTable";
import SearchBar from "../../components/admin/SearchBar";

const Users = () => {
  const [isFormOpen, setIsFormOpen] = useState(null); // ✅ can be "add" or "edit"
const cards = [
    { title: "Total Revenue", value: "₹1,34,09.98", value1: "+ ₹53,926 from last month", icon: VectorIcon },
    { title: "Pending Revenue ", value: "₹219", value1: "- ₹134 from last month", icon: VectorIcon },
    { title: "Total Transactions", value: "192", value1: "+ 34 from last month", icon: VectorIcon },
    { title: "Success Rate", value: "39%", value1: "+ 29% from last month", icon: VectorIcon },
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
            Revenue & Transactions
          </h2>

          {/* ✅ Add Staff Button */}
          {/* <button
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
          </button> */}
        </div>

        <p
          style={{
            fontSize: "14px",
            color: "#4B5563",
            marginBottom: "32px",
          }}
        >
          Manage and monitor all revenue transactions
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
      {/* Search Bar */}
          
         <br /><br />
          
          <div>
            <SearchBar />
          
          </div>


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
          {/* <h3 style={{ marginBottom: "16px", fontWeight: "bold" }}>
             Directory
          </h3> */}
          <p
            style={{
              marginBottom: "16px",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            {/* View and manage staff members and their permissions */}
          </p>

        

          {/* Table */}
           <SessionTable />
         
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
