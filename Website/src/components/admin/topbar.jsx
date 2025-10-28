import React from "react";
import logo from "../../assets/images/bentork_logo.png";
import bell from "../../assets/images/notification_bell.png";
import settings from "../../assets/images/setting_icon.png";

export default function Topbar({ onMenuClick }) {
  return (
    <header
      style={{
        width: "95%", // full width
        height: "70px",
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left side: Menu + Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Hamburger menu for mobile */}
        <button
          onClick={onMenuClick}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            display: "block",
          }}
        >
          ☰
        </button>

        <img
          src={logo}
          alt="BENTORK"
          style={{
            height: "50px",
            objectFit: "contain",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Right Side Icons */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img
          src={bell}
          alt="Notifications"
          style={{ height: "24px", width: "24px", cursor: "pointer" }}
        />
        <img
          src={settings}
          alt="Settings"
          style={{ height: "24px", width: "24px", cursor: "pointer" }}
        />
      </div>
    </header>
  );
}
