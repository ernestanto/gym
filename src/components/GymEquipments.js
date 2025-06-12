import React, { useState, useEffect } from 'react';
import { getFirestore, doc,getDocs,collection, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth , onAuthStateChanged} from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const db = getFirestore();
const auth = getAuth();

const machineCategories = [
  {
    title: '1🏃 Cardio Machines',
    items: [
      'Treadmill', 'Elliptical Cross Trainer', 'Stationary Bicycle (Upright Bike)',
      'Recumbent Bike', 'Spin Bike', 'Stair Climber', 'Rowing Machine',
      'Air Bike (Fan Bike)', 'Curve Treadmill', 'SkiErg (Ski Machine)'
    ]
  },
  {
    title: '2.🏋️ Strength Training Machines - Chest & Upper Body',
    items: [
      'Chest Press Machine', 'Pec Deck (Butterfly Machine)', 'Cable Crossover Machine',
       'Shoulder Press Machine', 'Lat Pulldown Machine',
      'Seated Row Machine', 'Bicep Curl Machine', 'Tricep Pushdown Machine',
      'Cable Lat Pullover', 'Delt Fly / Rear Delt Machine'
    ]
  },
  {
    title: '3.🔹 Core & Abs',
    items: [
      'Ab Crunch Machine', 'Oblique Twister Machine', 'Roman Chair / Hyperextension Bench', 'Ab Coaster'
    ]
  },
  {
    title: '4.🦵 Leg & Lower Body Machines',
    items: [
      'Leg Press Machine', 'Leg Curl Machine', 'Leg Extension Machine',
      'Hip Abduction / Adduction Machine', 'Calf Raise Machine', 'Glute Kickback Machine',
      'Hack Squat Machine', 'Lying Leg Curl Machine', 'Standing Leg Curl Machine',
      'Thigh Abductor Machine', 'Inner Thigh Machine'
    ]
  },
  {
    title: '5.🧘 Functional & Flexibility Equipment',
    items: [
      'Smith Machine', 'Functional Trainer / Multi-Pulley', 'Power Rack / Squat Rack',
      'Assisted Pull-up & Dip Machine', 'Kettlebell Stations', 'Battle Ropes Station',
      'Suspension Trainer (TRX)', 'Resistance Band Stations', 'Stretching Cage / Stretch Trainer'
    ]
  }
];

export default function GymMachines() {
  const [selected, setSelected] = useState([]);
  const [gymMachines, setGymMachines] = useState([]);
  const [faults, setFaults] = useState({});

  const navigate = useNavigate();

  // Inside GymMachines component, add the useEffect hook
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const fetchGymMachines = async () => {
      const machinesRef = collection(db, "users", user.uid, "Machines");
      const snapshot = await getDocs(machinesRef);

      const machinesData = [];
      const faultsData = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        machinesData.push(data.name);
        faultsData[data.name] = data.status;
      });

      setGymMachines(machinesData);
      setFaults(faultsData);
    };

    fetchGymMachines();
  });

  return () => unsubscribe(); // Clean up the listener on unmount
}, []);

  const handleCheck = (item) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAdd = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in.");
      return;
    }

    const userId = user.uid;

  for (const machine of selected) {
  const machineRef = doc(db, "users", userId, "Machines", encodeURIComponent(machine));
  await setDoc(machineRef, {
    name: machine,
    status: "added",
    message: `${machine} added to gym.`,
    timestamp: serverTimestamp()
  });
}

    setGymMachines(prev => [...new Set([...prev, ...selected])]);
    setSelected([]);
  };

  const toggleFault = async (machine) => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in.");
      return;
    }

    const newStatus = faults[machine] !== "fault" ? "fault" : "cleared";
    const message = newStatus === "fault" ? `${machine} has a fault` : `${machine} fault is cleared`;

    const userId = user.uid;
  const machineRef = doc(db, "users", userId, "Machines", encodeURIComponent(machine));
    await setDoc(machineRef, {
      name: machine,
      status: newStatus,
      message,
      timestamp: serverTimestamp()
    });

    setFaults(prev => ({
      ...prev,
      [machine]: newStatus
    }));
  };

  return (
    <div style={styles.page}>
      <div style={styles.page1} onClick={() => navigate('/db')}>
  Dumbells and Plates
</div>
      <h1 style={styles.heading}>Select Gym Machines</h1>
      <div style={styles.container}>
        {machineCategories.map((category, index) => (
          <div key={index} style={styles.category}>
            <h3>{category.title}</h3>
            {category.items.map(item => (
              <label key={item} style={styles.label}>
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => handleCheck(item)}
                />
                {item}
              </label>
            ))}
          </div>
        ))}
        <button onClick={handleAdd} style={styles.button}>Add Machines</button>

        
        <ul>
          {gymMachines.map((machine) => (
            <li key={machine} style={{ marginBottom: '20px' }}>
              <strong style={{ marginRight: '20px' }}>{machine}</strong>
             <div style={styles.list}>
              <input
                type="checkbox"
                checked={faults[machine] === 'fault'}
                onChange={() => toggleFault(machine)}
              />
              <label style={{ marginLeft: '8px', marginRight: '20px' }}>
                {faults[machine] === 'fault' ? 'Fault' : 'Cleared'}
              </label>

              {faults[machine] === 'fault' && (
                <span style={{ color: '#f87171' }}>{machine} has a fault</span>
              )}
              {faults[machine] === 'cleared' && (
                <span style={{ color: '#34d399' }}>{machine} fault is cleared</span>
              )}
              </div>
            </li>
          ))}
        </ul>
        
      </div>
    </div>
  );
}


const styles = {
  page: {
    background: 'linear-gradient(to right,rgb(195, 42, 185),rgb(222, 72, 135))',
    minHeight: '100vh',
    padding: '5vw',
    paddingLeft: '5vw',
    paddingRight: '5vw',
    color: '#fff',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    boxSizing: 'border-box'
  },
   page1: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    transition: 'background 0.3s',
  },
  heading: {
    textAlign: 'center',
    fontSize: 'clamp(24px, 5vw, 36px)',
    marginBottom: '30px'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '20px',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  list: {
  alignSelf: "flex-end",      // Align to the end if inside a flex column
  marginLeft: "auto",         // Push to the right in a flex row
  textAlign: "right",         // Align text to the right
  maxWidth: "400px",          // Optional: limit width for cleaner layout
},

  category: {
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
    marginBottom: '10px'
  },
  label: {
    display: 'block',
    margin: '5px 0',
    fontSize: 'clamp(14px, 2vw, 18px)'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#34d399',
    border: 'none',
    borderRadius: '8px',
    fontSize: 'clamp(14px, 2vw, 18px)',
    cursor: 'pointer',
    alignSelf: 'center',
    marginTop: '20px',
    fontWeight: 'bold',
    width: 'fit-content',
    maxWidth: '100%'
  },
  result: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '10px'
  }
};
