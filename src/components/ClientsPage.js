import React, { useEffect, useState } from "react";
import { collection, getDocs,doc,updateDoc } from "firebase/firestore";
import { db, storage } from "./firebase";
import { getAuth, onAuthStateChanged, } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";

const AllClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [user, setUser] = useState(null); // User state to manage authenticated user

  const [editableClient, setEditableClient] = useState(null);
const [isEditing, setIsEditing] = useState(false);


   // Fetch clients when user is set
  useEffect(() => {
  const fetchClients = async () => {
    const clientsRef = collection(db, "users", user.uid, "clients");
    const snapshot = await getDocs(clientsRef);

    const clientsWithCountdown = snapshot.docs.map((doc) => {
      const data = doc.data();
      const endDate = new Date(data.membershipEndingOn);
      return {
        id: doc.id,
        ...data,
        endDate,
      };
    });

    setClients(clientsWithCountdown);
  };

  if (user) fetchClients();
}, [user]);


useEffect(() => {
  const timer = setInterval(() => {
    setClients((prevClients) =>
      prevClients.map((client) => {
        const now = new Date();
        const timeDiff = client.endDate - now;

        if (timeDiff <= 0) {
          return {
            ...client,
            countdown: "Expired",
          };
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);

        return {
          ...client,
          countdown: `${days}d : ${hours}h : ${minutes}m : ${seconds}s left`,
        };
      })
    );
  }, 1000);

  return () => clearInterval(timer); // Cleanup
}, []);





useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the user if authenticated
      } else {
        setUser(null); // Set user to null if not authenticated
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  const handleSaveChanges = async (e) => {
  e.preventDefault();
  if (!user || !editableClient?.id) return;

  const clientRef = doc(db, "users", user.uid, "clients", editableClient.id);
  await updateDoc(clientRef, editableClient);

  // Refresh the client list
 const updatedClients = clients.map(client =>
  client.id === editableClient.id
    ? {
        ...editableClient,
        endDate: client.endDate,        // 🟢 preserve endDate
        countdown: client.countdown,    // 🟢 preserve countdown
      }
    : client
);

  setClients(updatedClients);

  setSelectedClient(editableClient);
  setIsEditing(false);
};



  const filteredClients = clients.filter(client => {
    const nameMatch = client.name?.toLowerCase().includes(search.toLowerCase());
    const phoneMatch = client.phone?.includes(search);
    return nameMatch || phoneMatch;
  });

  if (selectedClient) {

    const {
  name, email, phone, address, height, weight, gender, dob,
  gymJoinDate, bodyGoal, trainingMode, workoutPreference,
  medicalConditions, personalTrainerNeeded, personalTrainerName,
  workoutTime, feesPaidAmount, feesPaidDate, membershipMonths,
  totalDays,countdown, membershipStartedOn, membershipEndingOn,
  joinedBy, imageUrl // ✅ add this if you're using it
           } = selectedClient;

    return (


  <div style={styles.container}>
    <button onClick={() => setSelectedClient(null)} style={styles.backButton}>← Back</button>
    <h2 style={styles.heading}>Client Details</h2>

   

    

 {!isEditing && (                              //when no editing stage,show the below divs
  <>

 

  <div style={styles.lettersContainer}>

   

    {imageURL && (
    <div style={styles.imageContainer}>
      <img
        src={imageURL}
        alt="Client"
        style={styles.profileImage}
      />
      </div>
    )}


  <div style={styles.lettersContainerItem}>
    <strong>Name:</strong> {name}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Phone:</strong> {phone}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Email:</strong> {email}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Address:</strong> {address}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>DOB:</strong> {dob}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Gender:</strong> {gender}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Height:</strong> {height} cm
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Weight:</strong> {weight} kg
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Body Goal:</strong> {bodyGoal}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Gym Joined Date:</strong> {gymJoinDate}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Training Mode:</strong> {trainingMode}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Workout Preference:</strong> {workoutPreference}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Medical Conditions:</strong> {medicalConditions}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Personal Trainer Needed:</strong> {personalTrainerNeeded}
  </div>
  {personalTrainerNeeded === "yes" && (
    <div style={styles.lettersContainerItem}>
      <strong>Trainer Name:</strong> {personalTrainerName}
    </div>
  )}
  <div style={styles.lettersContainerItem}>
    <strong>Workout Time:</strong> {workoutTime}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Fees Paid:</strong> ₹{feesPaidAmount} on {feesPaidDate}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Membership:</strong> {membershipMonths} month(s)
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Total Days:</strong> {totalDays}
  </div>
  <div style={styles.lettersContainerItem}>
    <p><strong>Time Left:</strong> {countdown}</p>

  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Membership Started:</strong> {membershipStartedOn}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Membership Ending:</strong> {membershipEndingOn}
  </div>
  <div style={styles.lettersContainerItem}>
    <strong>Joined By:</strong> {joinedBy}
  </div>
</div>

 {/* ✅ Insert the Edit button right here */}
    <button
      onClick={() => {
        setEditableClient({ ...selectedClient });
        setIsEditing(true);
      }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        fontSize: '16px',
        zIndex: 1000,
      }}
    >
      Edit
    </button>
  </>
)}



{isEditing && editableClient && (
  <form
    onSubmit={handleSaveChanges}
    style={{
      padding: "20px",
      maxWidth: "900px",
      margin: "40px auto",
      backgroundColor: "#1e1e1e",
      color: "#fff",
      borderRadius: "12px",
      boxShadow: "0 0 12px rgba(0,0,0,0.4)",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}
  >
    <h2><center>Edit Client Info</center></h2>

    {[
      "name", "email", "phone", "address", "height", "weight", "gender", "dob",
      "gymJoinDate", "bodyGoal", "trainingMode", "workoutPreference",
      "medicalConditions", "personalTrainerNeeded", "personalTrainerName",
      "workoutTime", "feesPaidAmount", "feesPaidDate", "membershipMonths",
      "totalDays", "countdown ", "membershipStartedOn", "membershipEndingOn",
      "joinedBy", "imageUrl"
    ].map((field) => (
      <div key={field} style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor={field} style={{ fontWeight: "bold", marginBottom: "6px" }}>
          {field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
        </label>
        <input
          id={field}
          type={
            field.toLowerCase().includes("date") ? "date" :
            field.toLowerCase().includes("email") ? "email" :
            field.toLowerCase().includes("amount") || field.toLowerCase().includes("days") || field.toLowerCase().includes("months") || field === "height" || field === "weight" ? "number" : "text"
          }
          value={editableClient[field] || ""}
          onChange={(e) =>
            setEditableClient({ ...editableClient, [field]: e.target.value })
          }
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #555",
            backgroundColor: "#2a2a2a",
            color: "#fff"
          }}
        />
      </div>
    ))}

    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
      <button
        type="submit"
        style={{
          backgroundColor: "#28a745",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Update
      </button>

      <button
        type="button"
        onClick={() => setIsEditing(false)}
        style={{
          backgroundColor: "#dc3545",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Cancel
      </button>
    </div>
  </form>
)}


    </div>
  
);

  }

  

  return (
  <div style={styles.container}>
  <div style={styles.searchWrapper}>
    <input
      type="text"
      placeholder="Search by name or phone"
      value={search}
      onChange={e => setSearch(e.target.value)}
      style={styles.searchInput}
    />
  </div>

  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
    {filteredClients.map((client, index) => {
      const isActive = parseInt(client.countdown) > 0;
      return (
        <div
          key={index}
          onClick={() => setSelectedClient(client)}
          style={{
            ...styles.clientCard,
            backgroundColor: isActive ? "#1c1c1c" : "#2a2a2a",
            width: "fit-content",          // Let it shrink to fit content
            maxWidth: "270px",             // Optional: limit width
            margin: "10px",                // Add spacing between cards
            padding: "10px",               // Compact padding
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',    // Align items vertically within the card
              gap: '15px',                // spacing between elements inside card
              justifyContent: 'flex-start',
              padding: '10px',
              backgroundColor: '#1a1a1a', // overall background
              borderRadius: '15px',       // optional rounded corners for container
            }}
          >
            <div
              key={client.id}
              style={{
                border: '1px solid #444',
                borderRadius: '10px',
                padding: '10px',
                width: '220px',
                backgroundColor: 'inherit',
                color: 'white',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgb(255, 255, 255)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
              }}
            >
              <p><strong>NAME:</strong>{client.name}</p>
              <p><strong>PHONE:</strong> {client.phone}</p>
              <p><strong>DAYSLEFT:</strong> <strong> {client.countdown}</strong></p>
              <p><strong>MEMBERSHIP ENDS ON:</strong> {client.membershipEndingOn}</p>
               <p><strong>PERSONAL TRAINING:</strong> {client.personalTrainerNeeded}</p>

              {client.imageUrl ? (
                <img
                  src={client.imageUrl}
                  alt="Client"
                  style={{
                    width: '60%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginTop: '1px',
                    border: '2px solid #fff', // White border around the image
                  }}
                />
              ) : (
                <div style={{ color: '#bbb', marginTop: '10px' }}>No image available</div>
              )}

              <div
                style={{
                  ...styles.status,
                  backgroundColor: isActive ? "#28a745" : "#dc3545", // Green for active, Red for inactive
                  marginBottom: "10px", // Added margin bottom
                  marginTop: "20px",
                }}
              >
                {isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

);

};

export default AllClientsPage;

const styles = {
 container: {
  padding: "5vw",
  background: "linear-gradient(to right,rgb(29, 129, 107),rgb(130, 33, 168))",
  minHeight: "100vh",
  color: "#f0f0f0",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  alignItems: "center",
  overflowY: "auto", // ✅ Scrollbar is now only here
},

 heading: {
  marginBottom: "30px",
  marginTop: "10px", // ✅ Move heading closer to the top
  fontSize: "clamp(22px, 5vw, 32px)",
  fontWeight: "bold",
  textAlign: "center",
},

lettersContainer: {
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "#f1f1f1",
  padding: "10px", // Reduced padding to make it more compact
  borderRadius: "8px", // Reduced border radius for a tighter look
  maxWidth: "900px", // Reduced maxWidth for a more compact container
  margin: "10px auto", // Kept margin as is
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)", // Reduced shadow for a lighter effect
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  display: "flex",
  flexDirection: "column",
  gap: "10px", // Reduced gap between items
  textAlign: "center",
  alignItems: "center",
  height: "auto",
  width: "80%", // Made the width slightly smaller for a compact appearance
}
,


  lettersContainerItem: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    fontSize: "clamp(14px, 3vw, 18px)", // Adjust font size for responsiveness
    padding: "5px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)", // Subtle line separation between items
  },


  imageContainer: {
    display: "flex",
    justifyContent: "center", // Center the image horizontally
    width: "100%", // Ensure the container takes full width for proper centering
    marginBottom: "30px", // Add some space below the image
  },

   

  searchWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },

  searchInput: {
    padding: "12px 20px",
    width: "100%",
    maxWidth: "450px",
    borderRadius: "8px",
    border: "1px solid #333",
    outline: "none",
    textAlign: "center",
    background: "rgba(30, 30, 30, 0.8)",
    color: "#fff",
    fontSize: "clamp(14px, 2vw, 18px)",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(4px)",
  },

  clientCard: {
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "14px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "transform 0.2s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },

  clientCardHover: {
    transform: "scale(1.02)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.5)",
  },

  clientInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "clamp(14px, 2vw, 16px)",
  },

  status: {
    alignSelf: "flex-start",
    padding: "6px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    color: "#fff",
    fontSize: "clamp(12px, 1.8vw, 14px)",
    textAlign: "center",
    backgroundColor: "#28a745",
  },

  statusInactive: {
    backgroundColor: "#dc3545",
  },

 

  backButton: {
    marginBottom: "20px",
    backgroundColor: "#222",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "clamp(14px, 2vw, 16px)",
    transition: "background-color 0.2s",
  },

  profileImage: {
    width: "clamp(100px, 30vw, 160px)",
    height: "clamp(100px, 30vw, 160px)",
    objectFit: "cover",
    borderRadius: "12px",
    border: "3px solid #666",
  },

 

  // Media query styles for system view (optional)
  desktopView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
}; 