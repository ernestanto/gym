import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Adjust path if needed
import { doc,collection, getDocs, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';



function WeightSelector({ title, min, max, step, onAdd }) {
  const [weight, setWeight] = useState(min);
  const [quantity, setQuantity] = useState(1);

  const increaseWeight = () => {
    if (weight + step <= max) {
      setWeight(prev => +(prev + step).toFixed(1));
    }
  };

  const decreaseWeight = () => {
    if (weight - step >= min) {
      setWeight(prev => +(prev - step).toFixed(1));
    }
  };

  const increaseQuantity = () => {
    if (quantity < 100) setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div style={styles.selectorContainer}>
      <h2 style={styles.heading}>{title}</h2>
      <div style={styles.selector}>
        <button onClick={decreaseWeight} style={styles.button}>-</button>
        <span style={styles.weight}>{weight} kg</span>
        <button onClick={increaseWeight} style={styles.button}>+</button>
      </div>

      <div style={styles.selector}>
        <button onClick={decreaseQuantity} style={styles.button}>-</button>
        <span style={styles.weight}>Qty: {quantity}</span>
        <button onClick={increaseQuantity} style={styles.button}>+</button>
      </div>

      <button onClick={() => onAdd(weight, quantity)} style={styles.addButton}>Add</button>
    </div>
  );
}

export default function DumbbellPlateManager() {
  const [dumbbells, setDumbbells] = useState([]);
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [user, setUser] = useState(null); // User state to manage authenticated user

 const saveToFirestore = async (db, type, weight, quantity, setItems) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const userRef = collection(db, 'users', currentUser.uid, 'weights');
    const docRef = await addDoc(userRef, {
      type,
      weight,
      quantity,
      timestamp: serverTimestamp(),
    });

    // Update state with the Firestore doc ID
    setItems(prev => [
      ...prev,
      { id: docRef.id, type, weight, quantity } // Store `id` for later deletion
    ]);

    console.log('Saved with ID:', docRef.id);
  } catch (error) {
    console.error('Error saving to Firestore:', error.message);
  }
};

const deleteFromFirestore = async (db, itemId) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const itemRef = doc(db, 'users', currentUser.uid, 'weights', itemId);
    await deleteDoc(itemRef);
    console.log('Deleted from Firestore:', itemId);
  } catch (error) {
    console.error('Error deleting from Firestore:', error.message);
  }
};

  const addDumbbell = (weight, quantity) => {
    setDumbbells(prev => [...prev, { weight, quantity }]);
    saveToFirestore('dumbbell', weight, quantity);
  };

  const addPlate = (weight, quantity) => {
    setPlates(prev => [...prev, { weight, quantity }]);
    saveToFirestore('plate', weight, quantity);
  };

  const deleteDumbbell = async (index) => {
  const item = dumbbells[index];
  if (!item || !item.id) {
    console.warn('Invalid dumbbell item at index', index);
    return;
  }

  try {
    await deleteFromFirestore(db, item.id);
    setDumbbells(prev => prev.filter((_, i) => i !== index));
  } catch (err) {
    console.error('Error deleting dumbbell:', err.message);
  }
};

const deletePlate = async (index) => {
  const item = plates[index];
  if (!item || !item.id) {
    console.warn('Invalid plate item at index', index);
    return;
  }

  try {
    await deleteFromFirestore(db, item.id);
    setPlates(prev => prev.filter((_, i) => i !== index));
  } catch (err) {
    console.error('Error deleting plate:', err.message);
  }
};


 useEffect(() => {
  const fetchData = async () => {
    try {
      if (!user) return;

      const userRef = collection(db, 'users', user.uid, 'weights');
      const querySnapshot = await getDocs(userRef);

      const dumbbellsData = [];
      const platesData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = { id: doc.id, ...data }; // ✅ Add doc.id to each item

        if (data.type === 'dumbbell') {
          dumbbellsData.push(item);
        } else if (data.type === 'plate') {
          platesData.push(item);
        }
      });

      setDumbbells(dumbbellsData);
      setPlates(platesData);

    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    fetchData();
  }
}, [user]);

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

 

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏋️ Dumbbells & Plates Manager</h1>

      <WeightSelector title="Dumbbells" min={1} max={50} step={0.5} onAdd={addDumbbell} />
      <div style={styles.listSection}>
        <h3 style={styles.listTitle}>Added Dumbbells</h3>
        {dumbbells.map((item, index) => (
          <div key={index} style={styles.listItem}>
            {item.weight} kg - Qty: {item.quantity}
            <button style={styles.deleteButton} onClick={() => deleteDumbbell(index)}>🗑</button>
          </div>
        ))}
      </div>

      <WeightSelector title="Plates" min={2.5} max={25} step={0.5} onAdd={addPlate} />
      <div style={styles.listSection}>
        <h3 style={styles.listTitle}>Added Plates</h3>
        {plates.map((item, index) => (
          <div key={index} style={styles.listItem}>
            {item.weight} kg - Qty: {item.quantity}
            <button style={styles.deleteButton} onClick={() => deletePlate(index)}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}


// Example inline styles (you can move to CSS module or separate file if needed)
const styles = {
  container: {
    fontFamily: 'Segoe UI, Roboto, sans-serif',
    padding: '5vw',
    background: 'linear-gradient(to bottom, #0f0f0f, #1c1c1c)', // Dark background gradient
    color: '#f1f1f1',
    minHeight: '100vh',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '5vh',
    textAlign: 'center',
    letterSpacing: '1px',
    fontWeight: 'bold',
  },
  selectorContainer: {
    backgroundColor: '#1e1e1e',
    padding: '4vw',
    marginBottom: '6vh',
    borderRadius: '1rem',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: 500, // Makes the container responsive
  },
  heading: {
    marginBottom: '1.2rem',
    fontSize: '1.3rem',
    textAlign: 'center',
    color: '#fefefe',
    fontWeight: 'bold',
  },
  selector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5vw',
    marginBottom: '1.2rem',
    flexWrap: 'wrap',
    width: '100%',
  },
  button: {
    padding: '8px 16px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    background: '#333',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
  },
  weight: {
    fontSize: '1.1rem',
    minWidth: '90px',
    textAlign: 'center',
    color: '#ccc',
  },
  addButton: {
    marginTop: '1rem',
    padding: '10px 24px',
    fontSize: '1rem',
    background: 'linear-gradient(to right,rgb(255, 0, 102),rgb(190, 24, 182))', // Gradient for button
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '100%',
    transition: 'transform 0.2s',
    fontWeight: '600',
  },
  
  listTitle: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    borderBottom: '1px solid #333',
    paddingBottom: '0.5rem',
    textAlign: 'center',
  },
  listItem: {
  background: '#222',
  padding: '0.5rem 0.8rem',
  borderRadius: '8px',
  marginBottom: '0.6rem',
  display: 'inline-flex', // Make items inline
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.9rem',
  boxShadow: '0 1px 5px rgba(0,0,0,0.15)',
  flexWrap: 'nowrap',
  marginRight: '0.5rem',
  whiteSpace: 'nowrap',
},
listSection: {
  marginBottom: '4vh',
  width: '100%',
  maxWidth: 600,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
},

  deleteButton: {
    background: 'transparent',
    border: 'none',
    color: '#ff5c5c',
    fontSize: '1.4rem',
    cursor: 'pointer',
    transition: 'color 0.2s ease-in-out',
  },

  // Responsive Styles
  '@media (max-width: 600px)': {
    container: {
      padding: '4vw', // Reduced padding on smaller screens
    },
    title: {
      fontSize: '1.6rem', // Smaller font for mobile
    },
    selectorContainer: {
      padding: '5vw',
    },
    heading: {
      fontSize: '1.1rem',
    },
    button: {
      padding: '6px 12px', // Smaller buttons for mobile
      fontSize: '1rem',
    },
    weight: {
      fontSize: '1rem',
      minWidth: '70px', // Adjusting weight's width
    },
    addButton: {
      marginTop: '1rem',
      padding: '8px 18px', // Smaller button size
      fontSize: '1rem',
    },
    listSection: {
      marginBottom: '4vh', // Less margin for mobile
    },
    listTitle: {
      fontSize: '1.1rem', // Smaller title for mobile
    },
    listItem: {
      padding: '0.8rem', // Adjust padding for mobile
      fontSize: '0.9rem', // Smaller text for mobile
      marginBottom: '0.8rem',
    },
  },

  '@media (min-width: 601px)': {
    container: {
      padding: '5vw',
    },
    title: {
      fontSize: '2rem',
    },
    selectorContainer: {
      padding: '4vw',
    },
    heading: {
      fontSize: '1.3rem',
    },
    button: {
      padding: '8px 16px',
      fontSize: '1.2rem',
    },
    weight: {
      fontSize: '1.1rem',
      minWidth: '90px',
    },
    addButton: {
      marginTop: '1rem',
      padding: '10px 24px',
      fontSize: '1rem',
    },
    listSection: {
      marginBottom: '5vh',
    },
    listTitle: {
      fontSize: '1.2rem',
    },
    listItem: {
      padding: '1rem',
      fontSize: '1rem',
    },
  },
};

