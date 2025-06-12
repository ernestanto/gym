


const twilio = require('twilio');

require("dotenv").config();


const accountSid = process.env.TWILIO_SID;

const authToken = '497bc3c5b013cd0fe95c9acde19ddd1f';
const client = twilio(accountSid, authToken);

// ✅ Export a plain function — not router.post()
module.exports = async (req, res) => {
  const { to, date } = req.body;

  const message = `Your gym membership ends on ${date}. Kindly renew the membership. Thanks.`;

  try {
      const response = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
      body: message,
    });

    res.status(200).json({ success: true, sid: response.sid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};    
