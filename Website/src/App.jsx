import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLogin from "./pages/Admin/login";
import AdminRegister from "./pages/Admin/AdminRegister";
import Dashboard from "./pages/Admin/Dashboard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Keep token in sync with localStorage updates
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route always shows login page */}
        <Route path="/" element={<AdminLogin />} />

        {/* Login & Register */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/AdminRegister" element={<AdminRegister />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard/*"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
