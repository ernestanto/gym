import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const RegistrationPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const styles = {
    page: {
      minHeight: "100vh",
     background: "linear-gradient(to right, rgb(255, 255, 255), rgb(16, 75, 49))",

      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
      alignItems: "flex-start",
      padding: "60px 30px",
      boxSizing: "border-box",
      color: "#fff",
      gap: "30px",
    },
    heading: {
      width: "100%",
      fontSize: "36px",
      fontWeight: "bold",
      textAlign: "center",
      letterSpacing: "2px",
      marginBottom: "20px",
      textTransform: "uppercase",
      background: "linear-gradient(90deg, rgb(0, 0, 0), rgb(0, 0, 0))",
      color: "transparent",
      WebkitBackgroundClip: "text",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    },
    card: {
      width: "320px",
      height: "180px",
   background: "rgb(48, 153, 118)", // fallback

      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
    },
    cardHover: {
      transform: "scale(1.05)",
      boxShadow: "0 12px 36px rgba(0, 0, 0, 0.5)",
    },
    cardHeading: {
      fontSize: "40px",
      fontWeight: "plain" ,
      letterSpacing: "1px",
      marginBottom: "8px",
      color:"black",
    },
  };

  const navigate = useNavigate();


const cardData = [
  { title: "Registration ", path: "/form" },
  { title: "Clients page", path:"/clients" },
  { title: "GymEquipments", path:"/gymequipments" },
  { title: "PT clients", path:"/ptclients" },
  { title: "Clients detailing", path:"/filteredclients" },
  { title: "Attendance Handler", path:"/attendancehandler"  },
];



  const cardColors = [
  { background: "linear-gradient(to right,rgb(227, 96, 139), #86A8E7)" },
  { background: "linear-gradient(to right, #D4FC79, #96E6A1)" },
  { background: "linear-gradient(to right, #FFDEE9, #B5FFFC)" },
  { background: "linear-gradient(to right, #FBD786, #f7797d)" },
  { background: "linear-gradient(to right, #84fab0, #8fd3f4)" },
  { background: "linear-gradient(to right, #c2e59c, #64b3f4)" },
];


  return (
    <div style={styles.page}>
      <div style={styles.heading}>DASHBOARD</div>
    {cardData.map((card, index) => (
  <div
    key={index}
    style={{
      ...styles.card,
      ...(cardColors[index] || {}), // Apply color if defined
      ...(hoveredIndex === index ? styles.cardHover : {}),
    }}
    onMouseEnter={() => setHoveredIndex(index)}
    onMouseLeave={() => setHoveredIndex(null)}
    onClick={() => {
      if (card.path) navigate(card.path); // Navigate only if path exists
    }}
  >
    <div style={styles.cardHeading}>{card.title}</div>
  </div>
))}


    </div>
  );
};

export default RegistrationPage;



