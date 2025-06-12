import React, { useState } from "react";
import axios from 'axios';


const SendWhatsApp = () => {
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

 const handleSend = async () => {
  try {
    // Make the API request to the backend to send the WhatsApp message
    const response = await axios.post('http://localhost:5000/api/send-template', {
      to,          // Phone number (e.g., +91xxxxxxxxxx)
      date,        // The expiration date of the membership
    });

    // Display success or error based on the backend response
    if (response.data.success) {
      setMessageStatus("Message sent successfully! ✅");
    } else {
      setMessageStatus("❌ Failed to send message.");
    }
  } catch (err) {
    setMessageStatus("❌ An error occurred.");
    console.error(err);
  }
};


  return (
    <>
      <div className="send-whatsapp-container">
        <h2>📤 Send WhatsApp Message</h2>
        <input
          type="text"
          placeholder="Enter phone number (+91...)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Enter date (e.g. 12/1)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Enter time (e.g. 3pm)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input-field"
        />
        <button onClick={handleSend} className="send-button">
          Send WhatsApp
        </button>
        {messageStatus && <p className="message-status">{messageStatus}</p>}
      </div>

<style>
  {`
    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      background-size: cover;
      min-height: 100vh;
      color: #fff;
    }

    .send-whatsapp-container {
      padding: 30px;
      max-width: 500px;
      margin: 50px auto;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(8px);
      border-radius: 15px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
    }

    h2 {
      font-size: 1.8em;
      text-align: center;
      margin-bottom: 25px;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.6);
    }

    .input-field {
      width: 100%;
      padding: 12px 15px;
      margin-bottom: 18px;
      border: none;
      border-radius: 8px;
      font-size: 1em;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }

    .input-field::placeholder {
      color: #ccc;
    }

    .input-field:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 5px 2px #00ffae;
    }

    .send-button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(90deg, #00c6ff, #0072ff);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.2em;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.2s ease;
    }

    .send-button:hover {
      background: linear-gradient(90deg, #0072ff, #00c6ff);
      transform: scale(1.02);
    }

    .message-status {
      text-align: center;
      margin-top: 20px;
      font-weight: bold;
      color: #a0e9ff;
    }

    @media (max-width: 768px) {
      .send-whatsapp-container {
        padding: 20px;
        margin: 30px 15px;
      }

      .send-button {
        font-size: 1.1em;
      }

      .input-field {
        font-size: 1em;
      }
    }

    @media (max-width: 480px) {
      .send-whatsapp-container {
        padding: 15px;
      }

      h2 {
        font-size: 1.5em;
      }

      .send-button {
        font-size: 1em;
      }

      .input-field {
        font-size: 0.95em;
      }
    }
  `}
</style>

    </>
  );
};

export default SendWhatsApp;




