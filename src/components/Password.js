import React, { useState, useEffect } from "react";

function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [tips, setTips] = useState([]);

  useEffect(() => {
    evaluatePassword(password);
  }, [password]);

  const evaluatePassword = (pwd) => {
    const tipsArray = [];
    let score = 0;

    if (pwd.length >= 8) score++;
    else tipsArray.push("Use at least 8 characters");

    if (/[A-Z]/.test(pwd)) score++;
    else tipsArray.push("Add an uppercase letter");

    if (/[0-9]/.test(pwd)) score++;
    else tipsArray.push("Add a number");

    if (/[@$!%*?&#]/.test(pwd)) score++;
    else tipsArray.push("Add a special character");

    if (score === 0) setStrength("");
    else if (score <= 2) setStrength("Weak");
    else if (score === 3) setStrength("Medium");
    else setStrength("Strong");

    setTips(tipsArray);
  };

  const getBarColor = () => {
    switch (strength) {
      case "Weak":
        return "red";
      case "Medium":
        return "orange";
      case "Strong":
        return "green";
      default:
        return "#ccc";
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Password Strength Checker</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "10px",
        }}
      />
      {strength && (
        <>
          <div
            style={{
              height: "10px",
              width: "100%",
              backgroundColor: getBarColor(),
              marginBottom: "10px",
              borderRadius: "5px",
              transition: "0.3s",
            }}
          />
          <p>
            Strength: <strong>{strength}</strong>
          </p>
        </>
      )}
      {tips.length > 0 && (
        <ul style={{ color: "gray", fontSize: "14px" }}>
          {tips.map((tip, index) => (
            <li key={index}>⚠️ {tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PasswordChecker;
