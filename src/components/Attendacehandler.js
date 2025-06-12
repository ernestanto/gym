import React, { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "./firebase"; // adjust path

const AttendanceReportPage = () => {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchClients(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchClients = async (uid) => {
    const clientsRef = collection(db, "users", uid, "clients");
    const snapshot = await getDocs(clientsRef);
    const allClients = [];
    snapshot.forEach((doc) => {
      allClients.push({ id: doc.id, ...doc.data() });
    });
    setClients(allClients);
    fetchAttendance(uid, allClients, selectedDate);
  };

  const fetchAttendance = async (uid, clientList, date) => {
    setLoading(true);
    const results = {};
    for (let client of clientList) {
      const attendanceRef = doc(
        db,
        "users",
        uid,
        "clients",
        client.id,
        "attendance",
        date
      );
      const snap = await getDoc(attendanceRef);
      if (snap.exists()) {
        results[client.id] = snap.data();
      }
    }
    setAttendanceMap(results);
    setLoading(false);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (user) {
      fetchAttendance(user.uid, clients, date);
    }
  };

  const presentClients = clients.filter((client) =>
    attendanceMap.hasOwnProperty(client.id)
  );

  return (
    <div style={styles.page}>
        <style>
  {`
    @keyframes loadingAnim {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `}
</style>

      <div style={styles.container}>
        <h2 style={styles.heading}>🎯 Attendance Report</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          style={styles.dateInput}
        />
        {loading && (
  <div style={styles.loadingBarContainer}>
    <div style={styles.loadingBar}></div>
  </div>
)}

        {presentClients.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: 20 }}>
            No attendance records found for this date.
          </p>
        ) : (
          <ul style={styles.list}>
            {presentClients.map((client) => {
  const attendance = attendanceMap[client.id];
  const today = new Date();
  const membershipEnd = new Date(client.membershipEndingOn);
  const isExpired = membershipEnd < today;

  return (
    <li
      key={client.id}
      style={{
        ...styles.card,
        backgroundColor: isExpired ? "#8B0000" : "#006400",
        color: "#fff", // keeps text readable on dark background
        borderLeft: "5px solid transparent",
      }}
    >
      <span style={styles.text}>{client.name}</span>
      <span style={styles.text}>{client.phone}</span>
      <span style={styles.text}>
        Present at {attendance?.checkInTime}
      </span>
    </li>
  );
})}


          </ul>
        )}
      </div>
    </div>
  );
};

export default AttendanceReportPage;

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)", // deep gym feel
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
  },
  container: {
    width: "100%",
    maxWidth: "960px",
    background: "linear-gradient(to bottom right, #ffffff, #f2f2f2)",
    padding: "35px 30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(5px)",
    border: "1px solid #ccc",
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "30px",
    color: "#222",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  },
  dateInput: {
    display: "block",
    margin: "0 auto 30px",
    padding: "12px 18px",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "2px solid #888",
    width: "fit-content",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  loadingBarContainer: {
    width: "100%",
    height: "8px",
    backgroundColor: "#ccc",
    overflow: "hidden",
    borderRadius: "10px",
    marginBottom: "25px",
  },
  loadingBar: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, #00ff95, #00c9ff)",
    animation: "loadingAnim 1.5s ease-in-out infinite",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    marginBottom: "16px",
    borderRadius: "10px",
    backgroundColor: "#202c33", // dark stylish
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    borderLeft: "6px solid transparent",
    color: "white",
    flexWrap: "wrap",
    transition: "all 0.3s ease",
  },
  text: {
    fontSize: "1.05rem",
    fontWeight: "500",
    color: "#ffffff",
    minWidth: "30%",
    marginBottom: "8px",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
  },
};
