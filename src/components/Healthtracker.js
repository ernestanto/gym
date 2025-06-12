import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,setDoc
} from 'firebase/firestore';
import { db } from './firebase'; 

const Healthtracker = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [weekNumber, setWeekNumber] = useState(1);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [weekData, setWeekData] = useState({});
  const [editingWeeks, setEditingWeeks] = useState({});
  const [user, setUser] = useState(null); // ✅ Needed for user.uid

  const [editableClient, setEditableClient] = useState(null);

  


  useEffect(() => {
  const auth = getAuth();
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);

      try {
        const db = getFirestore();
        const clientRef = doc(db, 'users', currentUser.uid, 'clients', clientId);
        const clientSnap = await getDoc(clientRef);

        if (clientSnap.exists()) {
          const clientData = clientSnap.data();
          setClient(clientData);

          // Fetch all weeks under Healthtracker subcollection
          const healthtrackerRef = collection(
            db,
            'users',
            currentUser.uid,
            'clients',
            clientId,
            'Healthtracker'
          );
          const snapshot = await getDocs(healthtrackerRef);

          const loadedWeeks = [];
          const loadedWeekData = {};

          snapshot.forEach((doc) => {
            const weekName = doc.id;
            const weekInfo = doc.data();
            loadedWeeks.push(weekName);
            loadedWeekData[weekName] = weekInfo;
          });

          setWeeks(loadedWeeks);
          setWeekData(loadedWeekData);
        } else {
          console.warn('Client not found.');
        }
      } catch (error) {
        console.error('Error fetching client or weeks:', error);
      }
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, [clientId]);


  const handleAddWeek = () => {
    const weekTitle = `Week ${weekNumber}`;
    if (!weeks.includes(weekTitle)) {
      setWeeks(prev => [...prev, weekTitle]);
      setWeekData(prev => ({
        ...prev,
        [weekTitle]: {
          goal: '',
          weight: '',
          workouts: '',
          efficiency: '',
          food: '',
          hipSize: ''
        }
      }));
      setEditingWeeks(prev => ({ ...prev, [weekTitle]: true }));
      setWeekNumber(prev => prev + 1);
    }
  };

  const handleChange = (week, field, value) => {
    setWeekData(prev => ({
      ...prev,
      [week]: {
        ...prev[week],
        [field]: value
      }
    }));
  };

  const toggleEdit = (week) => {
    setEditingWeeks(prev => ({ ...prev, [week]: true }));
  };

  const handleSubmit = async (week) => {
  const db = getFirestore();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert("User not authenticated");
    return;
  }

  const currentWeekData = weekData[week];

  try {
    const weekRef = doc(db, "users", currentUser.uid, "clients", clientId, "Healthtracker", week);
    await setDoc(weekRef, {
      ...currentWeekData,
      timestamp: new Date()
    });
    alert(`Data for ${week} saved successfully!`);
  } catch (error) {
    console.error("Error saving data: ", error);
    alert("Failed to save data.");
  }
};




  return (
    <div className="week-container">
     <style>{`
  .week-container {
    background: linear-gradient(to right, #111, #1e1e1e);
    color: white;
    min-height: 100vh;
    padding: 20px;
    font-family: 'Segoe UI', sans-serif;
  }

  .week-title {
    font-size: 26px;
    margin-bottom: 20px;
    text-align: center;
  }

  .input-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .week-input {
    width: 120px;
    padding: 10px;
    font-size: 18px;
    border-radius: 5px;
    border: none;
    text-align: center;
    color: #000;
  }

  .adjust-button {
    background-color: #444;
    color: white;
    font-size: 24px;
    padding: 6px 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .adjust-button:hover {
    background-color: #666;
  }

 .add-button {
  background-color: #007bff;
  color: white;
  padding: 10px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 30px;

  display: block;
  margin-left: 690px;
}


  .add-button:hover {
    background-color: #0056b3;
  }

  

  .weeks-list {
  display: flex;
  flex-direction: row;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-behavior: smooth;
}

.week-box {
  background: linear-gradient(135deg, #1f1f1f, #292929);
  padding: 14px 18px;
  border-radius: 10px;
  min-width: 280px;
  max-width: 300px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex-shrink: 0;
  border: 1px solid #444;
}

.week-box:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 14px rgba(0,0,0,0.6);
}

.week-box h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 18px;
  color: #00ffc8;
}


  .input-label {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    color: #ccc;
    font-size: 15px;
    gap: 5px;
  }

  .input-field {
    padding: 8px 10px;
    font-size: 15px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #000;
  }

  .form-buttons {
    display: flex;
    gap: 15px;
    margin-top: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .form-button {
    padding: 8px 18px;
    font-size: 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .edit-btn {
    background-color: #ff9800;
    color: white;
  }

  .submit-btn {
    background-color: #28a745;
    color: white;
  }

  .edit-btn:hover {
    background-color: #e67e00;
  }

  .submit-btn:hover {
    background-color: #218838;
  }

  /* Tablet screens */
  @media (max-width: 768px) {
    .week-title {
      font-size: 22px;
    }

    .week-input {
      width: 100px;
      font-size: 16px;
    }

    .adjust-button {
      padding: 5px 12px;
      font-size: 20px;
    }

    .add-button {
      padding: 8px 24px;
      font-size: 15px;
    }

    .input-label {
      font-size: 14px;
    }

    .input-field {
      font-size: 14px;
    }

    .form-button {
      font-size: 13px;
      padding: 7px 14px;
    }

    .week-box {
      padding: 16px;
    }
  }

  /* Small mobile screens */
  @media (max-width: 480px) {
    .week-title {
      font-size: 20px;
    }

    .input-wrapper {
      flex-direction: column;
      gap: 8px;
    }

    .week-input {
      width: 100%;
      font-size: 15px;
    }

    .adjust-button {
      width: 100%;
      font-size: 18px;
    }

    .add-button {
      width: 100%;
      padding: 10px;
      font-size: 14px;
    }

    .week-box {
      width: 90%;
      padding: 14px;
    }

    .input-label {
      font-size: 13px;
    }

    .input-field {
      font-size: 13px;
      padding: 7px 9px;
    }

    .form-button {
      width: 100%;
      font-size: 13px;
      padding: 8px;
    }

    .form-buttons {
      flex-direction: column;
      align-items: stretch;
    }
  }
`}</style>


      {loading ? (
        <p>Loading...</p>
      ) : client ? (
        <>
          <h2 className="week-title">Health Tracker for {client.name}</h2>

          <div className="input-wrapper">
            <button className="adjust-button" onClick={() => setWeekNumber(prev => Math.max(1, prev - 1))}>−</button>
            <input className="week-input" type="text" value={`Week ${weekNumber}`} readOnly />
            <button className="adjust-button" onClick={() => setWeekNumber(prev => prev + 1)}>+</button>
          </div>

          <button className="add-button" onClick={handleAddWeek}>Add</button>

          <div className="weeks-list">
            {weeks.map((week, index) => {
              const data = weekData[week] || {};
              const isEditing = editingWeeks[week];

              return (
                <div key={index} className="week-box">
                  <h3>{week}</h3>
                  <label className="input-label">
                    Bodyweight Goal:
                    <select className="input-field" disabled={!isEditing} value={data.goal || ''} onChange={e => handleChange(week, 'goal', e.target.value)}>
                      <option value="">Select</option>
                      <option value="lean">Lean</option>
                      <option value="bulk">Bulk</option>
                    </select>
                  </label>

                  <label className="input-label">
                    Bodyweight (kg):
                    <input type="number" className="input-field" disabled={!isEditing} value={data.weight || ''} onChange={e => handleChange(week, 'weight', e.target.value)} />
                  </label>

                  <label className="input-label">
                    Workouts Concentrated:
                    <select className="input-field" disabled={!isEditing} value={data.workouts || ''} onChange={e => handleChange(week, 'workouts', e.target.value)}>
                      <option value="">Select</option>
                      <option value="strength">Strength Training</option>
                      <option value="cardio">Cardio</option>
                    </select>
                  </label>

                  <label className="input-label">
                    Client Efficiency:
                    <select className="input-field" disabled={!isEditing} value={data.efficiency || ''} onChange={e => handleChange(week, 'efficiency', e.target.value)}>
                      <option value="">Select</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </label>

                  <label className="input-label">
                    Foods Taken:
                    <select className="input-field" disabled={!isEditing} value={data.food || ''} onChange={e => handleChange(week, 'food', e.target.value)}>
                      <option value="">Select</option>
                      <option value="low-fat-high-protein">Low Fat, High Protein</option>
                      <option value="high-fat-junk">High Fat Content, Junk Foods</option>
                    </select>
                  </label>

                  <label className="input-label">
                    Hip Size (cm):
                    <input type="number" className="input-field" disabled={!isEditing} value={data.hipSize || ''} onChange={e => handleChange(week, 'hipSize', e.target.value)} />
                  </label>

                  <div className="form-buttons">
                    {isEditing ? (
                      <button className="form-button submit-btn" onClick={() => handleSubmit(week)}>Submit</button>
                    ) : (
                      <button className="form-button edit-btn" onClick={() => toggleEdit(week)}>Edit</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p>Client not found.</p>
      )}
    </div>
  );
};

export default Healthtracker;
