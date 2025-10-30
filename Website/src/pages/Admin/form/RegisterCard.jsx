import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    cardId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registered Card Data:", formData);
    // You can send data to backend here using fetch or axios
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "30px",
        padding: "30px",
        width: "400px",
        maxWidth: "90%",
        display: "flex",
        flexDirection: "column",
        
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
    <div style={styles.container}>
      <h2 style={styles.title}>Register Card</h2>
      <form  onSubmit={handleSubmit} style={styles.form}
    
      
      >
        <label style={styles.label}>Name</label>
        <input
          type="text"
          name="name"
          placeholder="John Ace"
          value={formData.name}
          onChange={handleChange}
        
          style={styles.input}
          
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          placeholder="john@xyz.com"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Contact</label>
        <input
          type="text"
          name="contact"
          placeholder="+91 -----------"
          value={formData.contact}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Card ID</label>
        <input
          type="text"
          name="cardId"
          placeholder="123-456-789"
          value={formData.cardId}
          onChange={handleChange}
          style={styles.input}
        />

        <div style={styles.buttonContainer}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={styles.backBtn}
          >
            Back
          </button>
          <button type="submit" style={styles.registerBtn}>
            Register
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontSize: "14px",
    color: "#6a5acd",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #aaa",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  registerBtn: {
    background: "black",
    color: "white",
    border: "none",
    padding: "10px 25px",
    borderRadius: "25px",
    cursor: "pointer",
  },
};

export default RegisterCard;
