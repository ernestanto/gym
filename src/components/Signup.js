import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from './firebase'; // Ensure db is correctly exported


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a document under users/{uid} with two fields: usercredentials and registrationform
      await setDoc(doc(db, "users", user.uid), {
        usercredentials: {
          email: user.email,
          createdAt: new Date()
        },
        registrationform: {} // You can fill this later if your form has more fields
      });

      alert("Signup successful! Now login.");
      navigate("/login");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.head}>Account creation</div>
      <div style={styles.container}>
        <h2 style={styles.heading}>Create an Account</h2>
        <p style={styles.subheading}>Sign up to get started</p>
        <form onSubmit={handleSignup} style={styles.form}>
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
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <p style={styles.text}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
      
<Link to="/form">Go to Registration Form</Link>
    </div>
  );
};




const styles = {
  background: {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Orbitron', sans-serif",
    color: "#fff",
    animation: "pulseBackground 10s infinite alternate",
  },
  head: {
    fontSize: "3.5rem",
    color: "#0ff",
    fontWeight: "bold",
    marginBottom: "30px",
    textShadow: "0 0 15px #0ff, 0 0 30px #0ff",
    animation: "glowText 2s infinite alternate",
  },
  container: {
    background: "rgba(28, 28, 28, 0.95)",
    padding: "50px 40px",
    borderRadius: "20px",
    boxShadow: "0 0 25px rgba(0, 240, 255, 0.4)",
    width: "360px",
    textAlign: "center",
    transition: "transform 0.3s ease-in-out",
  },
  heading: {
    fontSize: "26px",
    marginBottom: "10px",
    color: "#fff",
    textShadow: "0 0 8px #00f0ff",
  },
  subheading: {
    fontSize: "15px",
    marginBottom: "25px",
    color: "#ccc",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #00f0ff",
    backgroundColor: "#111",
    color: "#fff",
    outline: "none",
    fontSize: "15px",
    transition: "0.3s",
  },
  button: {
    padding: "14px",
    borderRadius: "10px",
    background: "linear-gradient(to right, #00f0ff, #0ff)",
    color: "#000",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 0 15px #00f0ff",
    transition: "0.3s ease-in-out",
  },
  buttonHover: {
    background: "linear-gradient(to right, #0ff, #00f0ff)",
    transform: "scale(1.05)",
  },
  text: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#bbb",
  },
  link: {
    color: "#00f0ff",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "0.3s",
  },
};



export default Signup;
