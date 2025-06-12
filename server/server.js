const express = require('express');
const cors = require('cors');
const app = express();

// 👇 Use the function you export from sendMessage.js
const sendMessage = require('./sendMessage');

app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'] }));
app.use(express.json());

// 👇 Mount the route exactly like this
app.post('/api/send-template', sendMessage);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
