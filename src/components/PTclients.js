import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth,onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';

const PersonalTrainingClients = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null); // ✅ Define user state here
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // ✅ Set the logged-in user
      } else {
        setUser(null); // ✅ Set null when user is logged out
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;

      const clientsRef = collection(db, "users", user.uid, "clients");
      const snapshot = await getDocs(clientsRef);

      const filteredClients = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(client => client.personalTrainerNeeded?.toLowerCase() === "yes");

      setClients(filteredClients);
    };

    fetchClients();
  }, [user]);

  const filteredClients = clients.filter(client =>
  client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  client.phone.includes(searchTerm)
);


 
  return (
    <div className="pt-container">
      <h2 className="pt-heading">PT Clients</h2>

      <div className="pt-search-wrapper">
  <input
    type="text"
    placeholder="Search by name or phone"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pt-search-input"
  />
</div>


      <ul className="pt-list">
  {filteredClients.map(client => (
    <li key={client.id} className="pt-card">
      <Link to={`/healthtracker/${client.id}`} className="pt-link">
        <h3 className="pt-name">{client.name}</h3>
        <p className="pt-detail"><strong>Phone:</strong> {client.phone}</p>
        <p className="pt-detail"><strong>Trainer:</strong> {client.personalTrainerName || "Not Assigned"}</p>
      </Link>
    </li>
  ))}
</ul>

      

      {/* Embedded style for responsiveness */}
      <style>
        {`
          .pt-container {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 30px;
  background: linear-gradient(145deg,rgb(37, 148, 216),rgb(25, 223, 210));
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  color: #f0f0f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease-in-out;
}

.pt-search-wrapper {
  width: 100%;
  max-width: 600px;
  margin: 20px auto 10px auto;
  padding: 10px;
  text-align: center;
}

.pt-search-input {
  width: 100%;
  max-width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background-color: #1f1f1f;
  color: white;
  outline: none;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
}

.pt-search-input::placeholder {
  color: #888;
}


          .pt-heading {
            font-size: 2rem;
            margin-bottom: 20px;
            text-align: center;
            color: white ;
          }

          .pt-message {
            text-align: center;
            font-size: 1.2rem;
            color: #777;
          }

          .pt-list {
            display: flex;
            flex-wrap: wrap;
            
            gap: 20px;
            justify-content: center;
            padding: 0;
            list-style: none;
          }

          .pt-card {
           background: linear-gradient(135deg,rgb(0, 0, 0),rgb(19, 118, 80),rgb(11, 95, 95));

            padding: 16px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 500px;
            box-sizing: border-box;
            transition: transform 0.2s ease;
          }

          .pt-card:hover {
            transform: scale(1.03);
          }

          .pt-name {
            font-size: 1.4rem;
            margin-bottom: 8px;
            color:white;
          }

          .pt-detail {
            font-size: 1rem;
           color:white;
            margin-bottom: 4px;
          }

          /* Tablet */
          @media (max-width: 768px) {
            .pt-heading {
              font-size: 1.6rem;
            }

            .pt-card {
              max-width: 90%;
            }

            .pt-name {
              font-size: 1.2rem;
            }

            .pt-detail {
              font-size: 0.95rem;
            }
          }

          /* Mobile */
          @media (max-width: 480px) {
            .pt-container {
              padding: 10px;
            }

            .pt-heading {
              font-size: 1.4rem;
            }

            .pt-name {
              font-size: 1rem;
            }

            .pt-detail {
              font-size: 0.9rem;
            }

            .pt-list {
              flex-direction: column;
              align-items: center;
            }

            .pt-card {
              width: 100%;
              max-width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PersonalTrainingClients;
