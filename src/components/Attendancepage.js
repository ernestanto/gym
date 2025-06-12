import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase"; // adjust if needed

const AttendancePage = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  const handleAttendance = async () => {
    if (!phone.trim()) {
      setMessage("Please enter your phone number.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const clientsRef = collection(db, "users", user.uid, "clients");
      const q = query(clientsRef, where("phone", "==", phone));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setMessage("Client not found. Check the phone number.");
        setLoading(false);
        return;
      }

      const clientDoc = snapshot.docs[0];
      const clientId = clientDoc.id;

      const attendanceRef = doc(
        db,
        "users",
        user.uid,
        "clients",
        clientId,
        "attendance",
        todayDate
      );

      const attendanceSnap = await getDoc(attendanceRef);

      if (attendanceSnap.exists()) {
        const data = attendanceSnap.data();
        setMessage(`✅ Already marked as Present at ${data.checkInTime}`);
      } else {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        await setDoc(attendanceRef, {
          checkInTime: time,
          status: "Present",
        });
        setMessage(`✅ Attendance marked at ${time}`);
        
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error marking attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📋 Attendance Page</h2>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAttendance} style={styles.button}  disabled={loading}>
          {loading ? "Marking..." : "Mark Attendance"}
        </button>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default AttendancePage;

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #2b5876, #4e4376)",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "30px 25px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "1.6rem",
    color: "#333",
  },
  input: {
  width: "100%",
  maxWidth: "400px",         // optional: limits the width on larger screens
  padding: "10px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "5px solid #ccc",
  marginBottom: "16px",
  margin: "0 auto",          // centers the input horizontally
  display: "block"           // required for margin auto to work
},

  button: {
    width: "100%",
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4e4376",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease",
    marginTop: "20px",
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold",
    color: "#444",
  },
};
