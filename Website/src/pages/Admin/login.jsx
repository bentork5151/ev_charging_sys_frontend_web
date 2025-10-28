import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Images
import ElectricCar from "../../assets/images/electric_car_admin_panel.png";
import stepStations from "../../assets/images/undraw_browsing-online_rozb.png";
import stepUsers from "../../assets/images/undraw_files-uploading_qf8u.png";
import stepSessions from "../../assets/images/undraw_group-project_kow1.png";
import stepReports from "../../assets/images/undraw_mobile-marketing_7x7m.png";
import arrowRight from "../../assets/images/arrow.png";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // ✨ Floating input renderer
  const renderInput = ({ label, type, value, onChange, onFocus, onBlur, focused }) => (
    <div style={{ position: "relative", width: "100%" }}>
      <label
        style={{
          position: "absolute",
          left: "12px",
          top: focused || value ? "-8px" : "50%",
          transform: focused || value ? "translateY(0)" : "translateY(-50%)",
          fontSize: focused || value ? "12px" : isMobile ? "13px" : "14px",
          color: focused ? "violet" : "#888",
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
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          padding: "10px",
          fontSize: isMobile ? "13px" : "14px",
          border: focused ? "2px solid violet" : "1px solid #ccc",
          borderRadius: "6px",
          width: "100%",
          height: "44px",
          outline: "none",
          transition: "border 0.2s ease",
        }}
      />
    </div>
  );

  // ✅ Handle login request
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailValue || !passwordValue) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrMobile: emailValue, password: passwordValue }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        alert(data.message || "Invalid credentials");
        return;
      }

      // ✅ FIXED: Store admin_token
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
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
          top: "52px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
      />

      {/* 🧾 Login Form */}
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          marginTop: isMobile ? "100px" : "100px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "372px",
          padding: isMobile ? "0 12px" : "0",
          position: "relative",
        }}
      >
        {renderInput({
          label: "Email ID or Mobile Number",
          type: "text",
          value: emailValue,
          onChange: (e) => setEmailValue(e.target.value),
          onFocus: () => setEmailFocused(true),
          onBlur: () => setEmailFocused(false),
          focused: emailFocused,
        })}

        {renderInput({
          label: "Password",
          type: "password",
          value: passwordValue,
          onChange: (e) => setPasswordValue(e.target.value),
          onFocus: () => setPasswordFocused(true),
          onBlur: () => setPasswordFocused(false),
          focused: passwordFocused,
        })}

        {/* 🔹 Forgot Password & Help */}
        <div
          style={{
            position: "absolute",
            right: "0",
            top: isMobile ? "150px" : "155px",
            display: "flex",
            gap: "8px",
            fontSize: isMobile ? "11px" : "12px",
          }}
        >
          <a href="#" style={{ color: "black", textDecoration: "none" }}>
            Forgot your password?
          </a>
          <a
            href="/help"
            style={{
              color: "black",
              textDecoration: "underline",
              fontWeight: "600",
            }}
          >
            Help
          </a>
        </div>

        {/* 🔘 Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            width: "100%",
            marginTop: "40px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/AdminRegister")}
            style={{
              width: isMobile ? "100%" : "132px",
              height: "48px",
              borderRadius: "18px",
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

          <button
            type="submit"
            style={{
              width: isMobile ? "100%" : "132px",
              height: "48px",
              borderRadius: "18px",
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
            Login
          </button>
        </div>
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
              <p
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 600,
                  fontSize: "18px",
                  margin: "0",
                  color: "#000",
                }}
              >
                {step.title}
              </p>
              <p
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 400,
                  fontSize: "12px",
                  margin: "0",
                  color: "#000000BF",
                }}
              >
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
