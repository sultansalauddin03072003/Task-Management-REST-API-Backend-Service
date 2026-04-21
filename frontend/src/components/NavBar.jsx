import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>📋 Task Manager</h2>
      <button style={styles.btn} onClick={logout}>Logout</button>
    </nav>
  );
}

const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#4f46e5", padding: "14px 30px" },
  logo: { color: "#fff", margin: 0, fontSize: "18px" },
  btn: { padding: "8px 18px", background: "#fff", color: "#4f46e5", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
};
