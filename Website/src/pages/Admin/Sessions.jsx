import React, { useState } from "react";
import SessionEdit from "./form/sessionedit"; // 👈 adjust name if file is SessionEdit.jsx

export default function Sessions() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="font-inter relative w-full">
      {!showForm ? (
        // ------------------ Default View ------------------
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {/* Heading */}
            <h2 className="text-[32px] font-bold font-lexend leading-none m-0 p-0">
              Session
            </h2>

            {/* Subheading */}
            <p className="text-[12px] font-normal font-inter leading-none m-0 p-0">
              Manage and customize EV charging Session parameters
            </p>
          </div>

          {/* Customize Button */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center font-roboto font-semibold text-[12px] leading-[100%] rounded-[18px]"
            style={{
              width: "132px",
              height: "48px",
              padding: "12px 28px",
              backgroundColor: "#1C1C1C", // matte black background
              color: "#FFFFFF", // white text
            }}
          >
            Customize
          </button>
        </div>
      ) : (
        // ------------------ Edit Form View ------------------
        <SessionEdit onBack={() => setShowForm(false)} />
      )}
    </div>
  );
}
