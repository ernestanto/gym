import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth,db } from './firebase';

const Login = () => {
  const [email, setEmail] = useState("");  // changed from username to email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Logged in user UID:", user.uid); // for debugging or Firestore access
      alert("Login successful!");
      navigate("/form"); // redirect after login
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.head}>Login spot</div>
      <div style={styles.container}>
        <h2 style={styles.heading}>Welcome Back!</h2>
        <p style={styles.subheading}>Login to continue</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.text}>
          Don't have an account? <Link to="/" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};






// Styling
const styles = {
  background: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,rgb(33, 133, 107),rgb(25, 227, 200))", // Stunning sunset gradient
    animation: "gradientAnimation 5s ease-in-out infinite", // Smooth gradient animation
  },

  "@keyframes gradientAnimation": {
    "0%": {
      background: "linear-gradient(135deg, #ff7e5f, #feb47b)", // Sunset colors
    },
    "50%": {
      background: "linear-gradient(135deg, #6a11cb, #2575fc)", // Cool blue gradient
    },
    "100%": {
      background: "linear-gradient(135deg, #ff7e5f, #feb47b)", // Sunset colors back
    },
  },

  head: {
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "80px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "5px",
    color: "white",
    background: "linear-gradient(45deg, rgb(255, 255, 255), rgb(255, 105, 180), rgb(255, 140, 0))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "4px 4px 20px rgba(0, 0, 0, 0.7)",
    padding: "12px 24px",
    borderRadius: "12px",
    animation: "pulse 2s infinite",
  },

  "@keyframes pulse": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.1)" },
    "100%": { transform: "scale(1)" },
  },

  container: {
    width: "380px",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0px 10px 50px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    backgroundColor: "#fff",
    animation: "fadeIn 0.5s ease-in-out",
  },

  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },

  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
    textTransform: "uppercase",
  },

  subheading: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  input: {
    padding: "14px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "#f5f5f5",
    transition: "0.3s",
  },

  inputFocus: {
    border: "1px solid #007BFF", // Blue border on focus
    backgroundColor: "#eaf4fe",
  },

  button: {
    padding: "14px",
    backgroundColor: "#FF6F61", // Attractive coral button color
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 5px 20px rgba(255, 111, 97, 0.3)", // Subtle glowing effect
  },

  buttonHover: {
    backgroundColor: "#FF4C33", // Slightly darker shade for hover effect
    transform: "scale(1.05)",
  },

  text: {
    marginTop: "12px",
    fontSize: "14px",
  },

  link: {
    color: "#FF6F61", // Button color as link color
    textDecoration: "none",
    fontWeight: "bold",
    transition: "0.3s",
  },

  linkHover: {
    color: "#FF4C33", // Darker shade for hover
    textDecoration: "underline",
  },
};



export default Login;
