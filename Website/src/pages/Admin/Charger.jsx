import React, { useState } from "react";
import StaffSummaryCards from "../../components/card/StaffSummaryCards";
import plusIcon from "../../assets/icons/stafficon/plus.svg";
import VectorIcon from "../../assets/icons/stafficon/Vector-3.svg";
import AddCharger from "./form/AddCharger"; // ✅ Correct import (not SessionPage)
// import DirectoryTable from "../../components/admin/DirectoryTable";

const Charger = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const cards = [
    { title: "Total Chargers", value: "123", value1: "+317 from last month", icon: VectorIcon },
    { title: "Available Chargers", value: "1", value1: "+23 from last month", icon: VectorIcon },
    { title: "AC Chargers", value: "1", value1: "+23 from last month", icon: VectorIcon },
    { title: "DC Chargers", value: "3", value1: "+23 from last month", icon: VectorIcon },
  ];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        fontFamily: "Roboto, sans-serif",
        background: "#F1F1F1",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <h2
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              fontFamily: "Lexend, sans-serif",
              margin: 0,
              flexGrow: 1,
            }}
          >
            Charger Management
          </h2>

          {/* Add Charger Button */}
          <button
            style={{
              height: "48px",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1E1E1E",
              color: "#fff",
              fontWeight: 600,
              fontSize: "12px",
              border: "none",
              cursor: "pointer",
              padding: "0 16px",
            }}
            onClick={() => setIsFormOpen(true)} // ✅ opens form
          >
            <img src={plusIcon} alt="Add" style={{ width: "24px", height: "24px", marginRight: "6px" }} />
            Add Charger
          </button>
        </div>

        <p style={{ fontSize: "14px", color: "#4B5563", marginBottom: "32px" }}>
          Manage charging stations and chargers across cities
        </p>

        {/* Cards Section */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "15px" }}>
          {cards.map((card, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                maxWidth: "230px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "14px",
                padding: "12px 20px",
                backgroundColor: "white",
                border: "0.2px solid #ddd",
                height: "90px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "12px", fontWeight: 400 }}>{card.title}</span>
                <span style={{ fontSize: "24px", fontWeight: 600 }}>{card.value}</span>
                <span style={{ fontSize: "12px", fontWeight: 400 }}>{card.value1}</span>
              </div>
              <img src={card.icon} alt="icon" style={{ width: "22px", height: "22px" }} />
            </div>
          ))}
        </div>
{/* <DirectoryTable /> */}
        {/* ✅ Conditionally show AddCharger form */}
        {isFormOpen && (
          <div style={{ marginTop: "40px" }}>
            <AddCharger onClose={() => setIsFormOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Charger;
