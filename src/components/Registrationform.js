import React, { useState,useEffect } from "react";
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { doc,collection,addDoc, setDoc } from "firebase/firestore"; // Firestore database operations
import { db, storage } from './firebase'; // Your Firebase configuration
import  { useRef } from "react";
import ProfileImageUploader from './ProfileImageUploader'; // Your custom image uploader component








function RegistrationForm() {
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  address: "",
  height: "",
  weight: "",
  gender: "",
  dob: "",
  image: null,
  imagePreview: "",

  // Extended Fields
  gymJoinDate: "",
  bodyGoal: "",                  // "lean" or "bulk"
  trainingMode: "",              // "easy", "moderate", or "hard"
  workoutPreference: "",         // "cardio" or "strength training"
  medicalConditions: "",
  personalTrainerNeeded: "",     // "yes" or "no"
  personalTrainerName: "",
  workoutTime: "",               // "morning" or "evening"
  feesPaidAmount: "",
  feesPaidDate: "",
  membershipMonths: "",
  totalDays: "",
  
  membershipStartedOn: "",
  membershipEndingOn: "",
  joinedBy: "",                  // "referred", "social media", or "personally found"
});



  const imageUploaderRef = useRef(null); // ✅ define the ref

   // 🧠 Auto-calculate when feesPaidDate or totalDays changes
 useEffect(() => {
  const { feesPaidDate, totalDays } = formData;

  if (feesPaidDate && totalDays) {
    const startDate = new Date(feesPaidDate);
    const totalDaysInt = parseInt(totalDays);

    if (!isNaN(startDate) && !isNaN(totalDaysInt)) {
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + totalDaysInt);

      const today = new Date();
      const timeDiff = endDate - today;
      const daysLeftCalc = Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0); // never negative

      setFormData((prevData) => ({
        ...prevData,
        membershipStartedOn: feesPaidDate,
        membershipEndingOn: endDate.toISOString().split('T')[0],
        daysLeft: daysLeftCalc,
      }));
    }
  }
}, [formData.feesPaidDate, formData.totalDays]);


 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  const handleImageChange = (file) => {
    const imageUrl = URL.createObjectURL(file); // Preview image locally
    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: imageUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      alert("You must be logged in to submit the form.");
      return;
    }
  
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      height: formData.height,
      weight: formData.weight,
      gender: formData.gender,
      dob: formData.dob,
      imageUrl: '', // Will be updated if image is uploaded
      gymJoinDate: formData.gymJoinDate,
  bodyGoal: formData.bodyGoal,
  trainingMode: formData.trainingMode,
  workoutPreference: formData.workoutPreference,
  medicalConditions: formData.medicalConditions,
  personalTrainerNeeded: formData.personalTrainerNeeded,
  personalTrainerName: formData.personalTrainerName,
  workoutTime: formData.workoutTime,
  feesPaidAmount: formData.feesPaidAmount,
  feesPaidDate: formData.feesPaidDate,
  membershipMonths: formData.membershipMonths,
  totalDays: formData.totalDays,
  
  membershipStartedOn: formData.membershipStartedOn,
  membershipEndingOn: formData.membershipEndingOn,
  joinedBy: formData.joinedBy,
    };
  
    try {
      // Upload image if selected
      if (formData.image) {
        console.log("Uploading image:", formData.image.name);
  
        const imageRef = ref(storage, `profileImages/${user.uid}/${formData.image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, formData.image);
  
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress.toFixed(0)}% done`);
            },
            (error) => {
              console.error("Error during image upload:", error);
              reject("Image upload failed. Please try again.");
            },
            async () => {
              try {
                // Corrected this line
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); // no parentheses
                console.log("Firebase Image URL:", downloadURL);
  
                // Store the URL in the user data and update the state
                userData.imageUrl = downloadURL;
                setFormData((prev) => ({
                  ...prev,
                  imageUrl: downloadURL,
                }));
  
                console.log("Image uploaded successfully. URL:", downloadURL);
                resolve();
              } catch (error) {
                console.error("Failed to get download URL:", error);
                reject("Failed to get uploaded image URL.");
              }
            }
          );
        });
  
      }
  
      // Save user data to Firestore
      const docRef = collection(db, "users", user.uid, "clients");
      await addDoc(docRef, userData);
      
  
      console.log("Registration form saved for UID:", user.uid);
      alert("Form Submitted Successfully!");

 // ✅ Clear form fields



setFormData({
  name: '',
  email: '',
  phone: '',
  address: '',
  height: '',
  weight: '',
  gender: '',
  dob: '',
  image: null,
  imagePreview: '',

  gymJoinDate: '',
  bodyGoal: '',
  trainingMode: '',
  workoutPreference: '',
  medicalConditions: '',
  personalTrainerNeeded: '',
  personalTrainerName: '',
  workoutTime: '',
  feesPaidAmount: '',
  feesPaidDate: '',
  membershipMonths: '',
  totalDays: '',
  
  membershipStartedOn: '',
  membershipEndingOn: '',
  joinedBy: '',
});


 // Reset image state after submission
 imageUploaderRef.current?.resetImageState(); // Clear preview, file input, etc.
setFormData((prev) => ({
  ...prev,
  image: null,
  imagePreview: null,
}));


  
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(typeof error === 'string' ? error : "Something went wrong. Please try again.");
    }
  };
  
  
  

  return (
    <div style={styles.page}>
  
     
      <form onSubmit={handleSubmit} style={styles.form}>
         <h2 style={styles.heading}>Registration Form</h2>
        <div style={styles.field}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.inputStyle}
          />
        

     
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.inputStyle}
          />
       

       
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={styles.inputStyle}
          />
       

       
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={{ ...styles.inputStyle, height: "60px" }}
          />
       

    
          <label>Height (cm):</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
            style={styles.inputStyle}
          />
       

       
          <label>Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            style={styles.inputStyle}
          />
       

     
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={styles.inputStyle}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        

       
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            style={styles.inputStyle}
          />
      
  {/* Gym Join Date */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Gym Join Date:</label>
  <input
    type="date"
    name="gymJoinDate"
    value={formData.gymJoinDate}
    onChange={handleChange}
    style={styles.inputStyle}
  />

  {/* Body Weight Goals */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Body Weight Goal:</label>
  <select
    name="bodyGoal"
    value={formData.bodyGoal}
    onChange={handleChange}
   style={styles.inputStyle}
  >
    <option value="">Select</option>
    <option value="lean">Lean</option>
    <option value="bulk">Bulk</option>
  </select>

  {/* Training Mode */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Training Mode Preference:</label>
  <select
    name="trainingMode"
    value={formData.trainingMode}
    onChange={handleChange}
    style={styles.inputStyle}
  >
    <option value="">Select</option>
    <option value="easy">Easy</option>
    <option value="moderate">Moderate</option>
    <option value="hard">Hard</option>
  </select>

  {/* Workout Preference */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Workout Preference:</label>
  <select
    name="workoutPreference"
    value={formData.workoutPreference}
    onChange={handleChange}
    style={styles.inputStyle}
  >
    <option value="">Select</option>
    <option value="cardio">Cardio</option>
    <option value="strength training">Strength Training</option>
  </select>

  {/* Medical Conditions */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Medical Conditions:</label>
  <textarea
    name="medicalConditions"
    value={formData.medicalConditions}
    onChange={handleChange}
    style={{ ...styles.inputStyle, height: '100px', resize: 'vertical' }}

  />

  {/* Personal Trainer Needed */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Need Personal Trainer?</label>
  <select
    name="personalTrainerNeeded"
    value={formData.personalTrainerNeeded}
    onChange={handleChange}
    style={styles.inputStyle}
  >
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>

  {/* Personal Trainer Name */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Personal Trainer Name:</label>
  <input
    type="text"
    name="personalTrainerName"
    value={formData.personalTrainerName}
    onChange={handleChange}
   style={styles.inputStyle}
  />

  {/* Workout Time */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Workout Time:</label>
  <select
    name="workoutTime"
    value={formData.workoutTime}
    onChange={handleChange}
    style={styles.inputStyle}
  >
    <option value="">Select</option>
    <option value="morning">Morning</option>
    <option value="evening">Evening</option>
  </select>

  {/* Fees Paid Amount */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Fees Paid Amount:</label>
  <input
    type="number"
    name="feesPaidAmount"
    value={formData.feesPaidAmount}
    onChange={handleChange}
    style={styles.inputStyle}
  />

  {/* Fees Paid Date */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Fees Paid Date:</label>
  <input
    type="date"
    name="feesPaidDate"
    value={formData.feesPaidDate}
    onChange={handleChange}
    style={styles.inputStyle}
  />

  {/* Membership Duration in Months */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Membership Duration (Months):</label>
  <input
    type="number"
    name="membershipMonths"
    value={formData.membershipMonths}
    onChange={handleChange}
    style={styles.inputStyle}
  />

  {/* Total Days */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Total Days:</label>
  <input
    type="number"
    name="totalDays"
    value={formData.totalDays}
    onChange={handleChange}
    style={styles.inputStyle}
  />

 

  {/* Membership Started On */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Membership Started On:</label>
  <input
    type="date"
    name="membershipStartedOn"
    value={formData.membershipStartedOn}
    onChange={handleChange}
    style={styles.inputStyle}
  />

  {/* Membership Ending On */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>Membership Ending On:</label>
  <input
    type="date"
    name="membershipEndingOn"
    value={formData.membershipEndingOn}
    onChange={handleChange}
   style={styles.inputStyle}
  />

  {/* How Joined the Gym */}
  <label style={{ fontSize: '16px', fontWeight: '600' }}>How Did You Find This Gym?</label>
  <select
    name="joinedBy"
    value={formData.joinedBy}
    onChange={handleChange}
    style={styles.inputStyle}
  >
    <option value="">Select</option>
    <option value="referred">Someone Referred</option>
    <option value="social media">Social Media</option>
    <option value="personally found">Personally Found</option>
  </select>




        {/* Profile Image Uploader */}
       
  <label>Upload Profile Picture:</label>
  <ProfileImageUploader ref={imageUploaderRef} onImageChange={handleImageChange} />

</div> 


        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    
    </div>
  );
}



const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg,rgb(97, 83, 83),rgb(20, 182, 155))", // Vibrant modern gradient
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

 form: {
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  padding: "40px 50px", // Add inner spacing
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
  maxWidth: "900px", // Wider form
  width: "100%", // Ensure it adapts responsively
  margin: "0 auto",
  boxSizing: "border-box",
  border: "1px solid #e5e7eb", // subtle border
  transition: "all 0.3s ease",
},

field: {
  padding: '22px 24px', // Increase padding for a larger area inside the field
  display: 'flex',
  flexDirection: 'column',
  gap: '14px', // Increased gap between fields for better spacing
  backgroundColor: '#f7fafd',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  fontSize: '17px',
  fontWeight: '500',
  color: '#094067',
  border: '1px solid #d8eefe',
  position: 'relative',
  zIndex: 1,
  cursor: 'default',
  overflow: 'hidden',
},


heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "600",
    color: "#0a66c2", // LinkedIn blue
  },

  inputStyle: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d8eefe',
    backgroundColor: '#f7fafd',
    fontSize: '16px',
    fontWeight: '500',
    color: '#094067',
    width: '100%',
    marginBottom: '12px',
    boxSizing: 'border-box',
    transition: '0.3s ease',
  },


  imagePreviewContainer: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #ccc',
    marginTop: '10px',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  label: {
    fontWeight: "500",
    marginBottom: "6px",
    fontSize: "15px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  textarea: {
    width: "100%",
    padding: "10px 14px",
    height: "90px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    resize: "none",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
  },
  imageFrame: {
    width: "160px",
    height: "160px",
    margin: "20px auto",
    border: "2px dashed #aaa",
    borderRadius: "50%",
    overflow: "hidden",
    background: "#fafafa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: "14px",
    backgroundColor: "#0a66c2",
    color: "#fff",
    fontSize: "17px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#004182",
  },
};

export default RegistrationForm;