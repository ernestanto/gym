const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
admin.initializeApp();

exports.getImageUrl = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const {path} = req.query;

    if (!path) {
      return res.status(400).json({error: "Missing 'path' query parameter."});
    }

    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(path);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });
      res.status(200).json({url});
    } catch (error) {
      console.error("Error generating signed URL:", error);
      res.status(500).json({error: "Failed to get signed URL"});
    }
  });
});

