import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { fullName, email, contactNo, password, confirmPassword } = form;

    if (!fullName || !email || !contactNo || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          mobile: contactNo,
          password,
        }),
      });

      const result = await response.text();

      if (!response.ok) {
        alert(result || "Registration failed");
        return;
      }

      alert("Registration successful!");
      navigate("/login");

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      {/* INTERNAL CSS (Optimized & Lightweight) */}
      <style>{`
        .register-container {
          display: flex;
          height: 100vh;
          font-family: "Inter", sans-serif;
        }

        .left-panel {
          flex: 1;
          background: #1E1E1E;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          text-align: center;
        }

        .logo-img {
          width: 120px;
          margin-bottom: 20px;
        }

        .panel-heading {
          font-size: 26px;
          margin-bottom: 8px;
        }

        .panel-desc {
          font-size: 13px;
          opacity: 0.8;
          max-width: 250px;
        }

        .right-panel {
          flex: 1;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 60px;
        }

        .title {
          font-size: 28px;
          margin: 0;
          font-family: "Gabarito", sans-serif !important;
        }

        .subtitle {
          font-size: 13px;
          opacity: 0.7;
          margin-bottom: 25px;
        }

        .reg-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .reg-input {
          padding: 12px;
          font-size: 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
          outline: none;
        }

        .reg-input:focus {
          border-color: #1E1E1E;
        }

        .login-text {
          text-align: center;
          font-size: 13px;
          margin-top: 5px;
        }

        .login-text span {
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
          margin-left: 3px;
        }

        .reg-button {
          width: 150px;
          padding: 12px;
          background: #1E1E1E;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          margin: 10px auto 0;
          font-size: 15px;
        }

        @media (max-width: 900px) {
          .register-container {
            flex-direction: column;
          }

          .left-panel {
            height: 35vh;
            padding: 20px;
          }

          .right-panel {
            height: 65vh;
            padding: 30px;
          }
        }
      `}</style>

      <div className="register-container">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <img
            src="https://raw.githubusercontent.com/bentork5151/assets/refs/heads/main/Logo/logo_inverted.png"
            alt="Bentork Logo"
            className="logo-img"
          />

          <h3 className="panel-heading">ADMIN PANEL</h3>
          <p className="panel-desc">
            Manage charging stations, users, and sessions all in one place.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <h2 className="title">Create Account</h2>
          <p className="subtitle">Fill in the details to get started</p>

          <form className="reg-form" onSubmit={handleRegister}>
            <input
              className="reg-input"
              type="text"
              name="fullName"
              placeholder="Your Full Name"
              value={form.fullName}
              onChange={handleChange}
            />

            <input
              className="reg-input"
              type="email"
              name="email"
              placeholder="Email ID"
              value={form.email}
              onChange={handleChange}
            />

            <input
              className="reg-input"
              type="tel"
              name="contactNo"
              placeholder="Contact No."
              value={form.contactNo}
              onChange={handleChange}
            />

            <input
              className="reg-input"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <input
              className="reg-input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <div className="login-text">
              Already have an account?
              <span onClick={() => navigate("/login")}> Login </span>
            </div>

            <button className="reg-button" type="submit">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
