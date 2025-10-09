import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Images
import ElectricCar from "../../assets/images/electric_car_admin_panel.png";
import stepStations from "../../assets/images/undraw_browsing-online_rozb.png";
import stepUsers from "../../assets/images/undraw_files-uploading_qf8u.png";
import stepSessions from "../../assets/images/undraw_group-project_kow1.png";
import stepReports from "../../assets/images/undraw_mobile-marketing_7x7m.png";
import arrowRight from "../../assets/images/arrow.png";

export default function AdminRegister() {
  const navigate = useNavigate();

  // 🧠 Form states
  const [fullName, setFullName] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✨ Focus animation states
  const [focusedField, setFocusedField] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // 📱 Detect screen size
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // 🧩 Floating input field generator
  const renderInput = ({ label, type, value, onChange, name }) => (
    <div style={{ position: "relative", flex: 1, width: "100%" }}>
      <label
        style={{
          position: "absolute",
          left: "12px",
          top: focusedField === name || value ? "-8px" : "50%",
          transform:
            focusedField === name || value ? "translateY(0)" : "translateY(-50%)",
          fontSize: focusedField === name || value ? "12px" : isMobile ? "13px" : "14px",
          color: focusedField === name ? "violet" : "#888",
          background: "#fff",
          padding: "0 4px",
          zIndex: 1,
          transition: "all 0.2s ease",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField("")}
        style={{
          padding: "10px",
          fontSize: isMobile ? "13px" : "14px",
          border: focusedField === name ? "2px solid violet" : "1px solid #ccc",
          borderRadius: "6px",
          width: "100%",
          height: "44px",
          outline: "none",
          transition: "border 0.2s ease",
        }}
      />
    </div>
  );

  // ✅ Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !emailValue || !contactNo || !passwordValue || !confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    if (passwordValue !== confirmPassword) {
      alert("Password and Confirm Password must match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ Match backend field names
        body: JSON.stringify({
          name: fullName,
          email: emailValue,
          mobile: contactNo,
          password: passwordValue,
        }),
      });

      const result = await response.text();
      console.log("Backend Response:", result);

      if (!response.ok) {
        alert(result || "Registration failed. Please try again.");
        return;
      }

      alert("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "Roboto, sans-serif",
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      {/* 🧭 Header */}
      <div>
        <h1 style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: "700", margin: 0 }}>
          Admin Panel
        </h1>
        <h2
          style={{
            fontSize: isMobile ? "26px" : "32px",
            fontWeight: "900",
            textDecoration: "underline",
            margin: 0,
          }}
        >
          BENTORK
        </h2>
        <p style={{ fontSize: isMobile ? "12px" : "14px", color: "black", margin: 0 }}>
          connecting to the modern world
        </p>
      </div>

      {/* 🚗 Electric Car Image */}
      <img
        src={ElectricCar}
        alt="EV charging"
        style={{
          width: isMobile ? "180px" : "221px",
          height: "auto",
          position: "absolute",
          top: "53px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
      />

      {/* 📝 Registration Form */}
      <form
        onSubmit={handleRegister}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          marginTop: isMobile ? "100px" : "90px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "372px",
          padding: isMobile ? "0 12px" : "0",
        }}
      >
        {renderInput({
          label: "Your Full Name",
          type: "text",
          value: fullName,
          onChange: (e) => setFullName(e.target.value),
          name: "fullName",
        })}

        <div
          style={{
            display: "flex",
            gap: "30px",
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {renderInput({
            label: "Email ID",
            type: "email",
            value: emailValue,
            onChange: (e) => setEmailValue(e.target.value),
            name: "email",
          })}

          {renderInput({
            label: "Contact No.",
            type: "tel",
            value: contactNo,
            onChange: (e) => setContactNo(e.target.value),
            name: "contact",
          })}
        </div>

        <div
          style={{
            display: "flex",
            gap: "30px",
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {renderInput({
            label: "Password",
            type: "password",
            value: passwordValue,
            onChange: (e) => setPasswordValue(e.target.value),
            name: "password",
          })}

          {renderInput({
            label: "Confirm Password",
            type: "password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            name: "confirmPassword",
          })}
        </div>

        {/* 🔗 Login Link */}
        <div
          style={{
            fontSize: isMobile ? "11px" : "12px",
            width: "100%",
            display: "flex",
            justifyContent: "right",
            gap: "6px",
            marginTop: "4px",
          }}
        >
          <p style={{ margin: 0, color: "black" }}>
            Already have an Account?
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "black",
                fontWeight: "600",
                textDecoration: "underline",
                marginLeft: "4px",
                cursor: "pointer",
              }}
            >
              Login
            </span>
          </p>
        </div>

        <button
          type="submit"
          style={{
            width: isMobile ? "100%" : "132px",
            height: "48px",
            marginTop: "16px",
            borderRadius: "6px",
            padding: "12px 28px",
            background: "#1E1E1E",
            color: "white",
            fontSize: isMobile ? "13px" : "14px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 250ms ease",
          }}
        >
          Register
        </button>
      </form>

      {/* 🧭 Admin Flow Section */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          width: "100%",
          maxWidth: "1200px",
          padding: "20px 12px",
          textAlign: "center",
        }}
      >
        {[
          { img: stepStations, title: "Stations", desc: "View and manage all charging stations." },
          { img: stepUsers, title: "Users", desc: "Add, edit, or remove user accounts." },
          { img: stepSessions, title: "Sessions", desc: "Monitor active and past charging sessions." },
          { img: stepReports, title: "Reports", desc: "Analyze usage data and financial reports." },
        ].map((step, index, arr) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              gap: "20px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img
                src={step.img}
                alt={step.title}
                style={{
                  width: isMobile ? "80px" : "120px",
                  height: "auto",
                  marginBottom: "10px",
                }}
              />
              <p style={{ fontFamily: "Roboto", fontWeight: 600, fontSize: "18px", margin: "0", color: "#000" }}>
                {step.title}
              </p>
              <p style={{ fontFamily: "Roboto", fontWeight: 400, fontSize: "12px", margin: "0", color: "#000000BF" }}>
                {step.desc}
              </p>
            </div>
            {!isMobile && index < arr.length - 1 && (
              <img src={arrowRight} alt="Arrow" style={{ width: "80px", height: "auto" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
