import React, { useState } from "react";
import planSvg from "../../../assets/images/editform.svg";
import Bottomnav from "../../../components/admin/Bottomnav";

const ACCENT = "#7c3aed";

function EditForm({ plan, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: plan?.id || null,
    planName: plan?.planName || "",
    description: plan?.description || "",
    durationMin: plan?.durationMin || null,
    rate: plan?.rate || null,
    walletDeduction: plan?.walletDeduction || null,
    chargerType: plan?.chargerType || "",
  });

  const [showModal, setShowModal] = useState(false);

  // Handle input change safely
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "durationMin" ||
        name === "rate" ||
        name === "walletDeduction"
          ? value === "" ? null : Number(value) // convert to number or null
          : value,
    }));
  };

  const handleSubmit = () => setShowModal(true);

  const confirmSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/plans/update/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planName: formData.planName,
            description: formData.description,
            durationMin: formData.durationMin,
            rate: formData.rate,
            walletDeduction: formData.walletDeduction,
            chargerType: formData.chargerType,
          }),
        }
      );

      if (res.ok) {
        let updated;
        try {
          updated = await res.json();
        } catch {
          updated = formData; // fallback if no JSON returned
        }

        // ✅ Tell parent to update list instantly
        if (onSave) onSave(updated);

        // ✅ Close the form automatically
        if (onClose) onClose();
      } else {
        // ❌ removed alert — only console log
        console.error("Failed to update plan:", await res.text());
      }
    } catch (err) {
      console.error("Update error:", err);
    }
    setShowModal(false);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div style={{ flex: 1, padding: "40px 56px" }}>
        <h2 style={{ fontWeight: 600, fontSize: "24px", marginBottom: "30px" }}>
          Edit Plan
        </h2>

        {/* Form */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            maxWidth: "800px",
          }}
        >
          <FloatingInput
            label="Plan Name"
            name="planName"
            value={formData.planName}
            onChange={handleChange}
          />
          <FloatingInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <FloatingInput
            label="Duration (Minutes)"
            name="durationMin"
            value={formData.durationMin ?? ""}
            onChange={handleChange}
            type="number"
          />
          <FloatingInput
            label="Rate (₹/kWh)"
            name="rate"
            value={formData.rate ?? ""}
            onChange={handleChange}
            type="number"
          />
          <FloatingInput
            label="Wallet Deduction (₹/min)"
            name="walletDeduction"
            value={formData.walletDeduction ?? ""}
            onChange={handleChange}
            type="number"
          />
          <FloatingInput
            label="Charger Type"
            name="chargerType"
            value={formData.chargerType}
            onChange={handleChange}
          />
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <img src={planSvg} alt="Plan Illustration" style={{ maxWidth: "300px" }} />
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          padding: "0 40px",
          boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Bottomnav onBack={onClose} onSubmit={handleSubmit} />
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>
            Confirm Update
          </h2>
          <p>Are you sure you want to save changes?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: "#f5f5f5",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmSubmit}
              style={{
                background: "#000",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          width: "400px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FloatingInput({ label, name, value, onChange, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <label
        style={{
          position: "absolute",
          left: 12,
          top: focused || value ? -8 : "50%",
          transform: focused || value ? "translateY(0)" : "translateY(-50%)",
          fontSize: focused || value ? 12 : 14,
          color: focused ? ACCENT : "#888",
          background: "#fff",
          padding: "0 4px",
          transition: "all 0.2s ease",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          height: 50,
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}

export default EditForm;
