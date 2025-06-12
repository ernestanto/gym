import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Adjust path if needed

const FilteredClients = () => {
  const [feesClients, setFeesClients] = useState([]);
  const [ageClients, setAgeClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [search1, setSearch1] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

useEffect(() => {
  const fetchClients = async () => {
    if (!user) return;

    try {
      const clientsRef = collection(db, "users", user.uid, "clients");
      const snapshot = await getDocs(clientsRef);

      const now = new Date();
      const allClients = snapshot.docs.map(doc => {
        const data = doc.data();
        const dob = new Date(data.dob);
        const age = now.getFullYear() - dob.getFullYear();
        return { id: doc.id, ...data, age };
      });

      // ✅ Premium clients (feesPaidAmount > 3000)
      setFeesClients(allClients.filter(c => {
        const amount = parseInt(c.feesPaidAmount, 10) || 0;
        return amount > 3000;
      }));

      // ✅ Senior clients (age > 50)
      setAgeClients(allClients.filter(c => c.age > 50));
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchClients();
}, [user]);


  if (loading) return <p style={{ color: '#fff', textAlign: 'center', padding: '20px' }}>Loading clients...</p>;

  const filteredPremiumClients = feesClients.filter(client =>
  client.name.toLowerCase().includes(search.toLowerCase()) ||
  client.phone.includes(search)
);

const filteredElderClients = ageClients.filter(client =>
  client.name.toLowerCase().includes(search1.toLowerCase()) ||
  client.phone.includes(search1)
);


  // ✅ Inline Styles
 const containerStyle = {
  minHeight: '100vh', // full screen height
  backgroundColor: '#121212', // dark background
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  padding: '20px',
  boxSizing: 'border-box',
  color: 'white',
  fontFamily: 'Arial, sans-serif',
};

const responsiveWrapper = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};



const sectionStyle = {
  backgroundColor: '#1f1f1f',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  flex: '1',
};



// Apply responsive changes manually (outside of style object)
const mediaQuery = window.matchMedia('(min-width: 768px)');
if (mediaQuery.matches) {
  responsiveWrapper.flexDirection = 'row';
  responsiveWrapper.justifyContent = 'space-between';
  sectionStyle.width = '48%';
}

const headingStyle = {
  marginBottom: '16px',
  color: '#00ffe5',
  fontSize: '24px',
  fontWeight: '600',
  textShadow: '0 0 8px rgba(0, 255, 229, 0.3)',
};



const searchWrapperStyle = {
  marginBottom: '15px',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
};

const searchInputStyle = {
  width: '90%',
  maxWidth: '400px',
  padding: '10px 15px',
  borderRadius: '8px',
  border: '1px solid #888',
  backgroundColor: '#2c2c2c',
  color: 'white',
  fontSize: '16px',
  outline: 'none',
  transition: '0.3s border ease',
};

searchInputStyle[':focus'] = {
  border: '1px solid #00ffe5'
};






const cardStyle = {
  backgroundColor: '#2a2a2a',
  border: '1px solid #444',
  borderRadius: '12px',
  padding: '18px',
  marginBottom: '16px',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  cursor: 'pointer',
};

const cardHoverStyle = {
  transform: 'scale(1.02)',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
};


  return (
   
    <div style={containerStyle}>
      <div style={responsiveWrapper}>
        <div style={sectionStyle}>
          <h2 style={headingStyle}>🪙 Premium Clients</h2>
         <div style={searchWrapperStyle}>
  <input
    type="text"
    placeholder="Search by name or phone"
    value={search}
    onChange={e => setSearch(e.target.value)}
    style={searchInputStyle}
  />
</div>

         {filteredPremiumClients.length === 0 ? (
  <p>No clients found.</p>
) : (
  filteredPremiumClients.map(client => (
              <div key={client.id} style={cardStyle}>
                <p><strong>Name:</strong> {client.name}</p>
                <p><strong>Fees Paid:</strong> ₹{client.feesPaidAmount}</p>
                  <p><strong>Phone:</strong> {client.phone}</p>

                <p><strong>DOB:</strong> {client.dob}</p>
                {client.imageUrl ? (
                <img
                  src={client.imageUrl}
                  alt="Client"
                  style={{
                    width: '30%',
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


              </div>
            ))
          )}
        </div>
        
          




      
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Elder clients</h2>
         <div style={searchWrapperStyle}>
  <input
    type="text"
    placeholder="Search by name or phone"
    value={search1}
    onChange={e => setSearch1(e.target.value)}
    style={searchInputStyle}
  />
</div>

         {filteredElderClients.length === 0 ? (
  <p>No clients found.</p>
) : (
  filteredElderClients.map(client => (

              <div key={client.id} style={cardStyle}>
                <p><strong>Name:</strong> {client.name}</p>
                <p><strong>Age:</strong> {client.age}</p>
                  <p><strong>Phone:</strong> {client.phone}</p>
                <p><strong>DOB:</strong> {client.dob}</p>
                {client.imageUrl ? (
                <img
                  src={client.imageUrl}
                  alt="Client"
                  style={{
                    width: '30%',
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

              </div>
            ))
          )}
        </div>
      </div>
    </div>
   
  );
};

export default FilteredClients;
