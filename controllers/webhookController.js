// controllers/webhookController.js
const { processMessage } = require("../services/botService"); // Import the processMessage function

// Webhook handler
const webhookHandler = async (req, res) => {
  try {
    const message = req.body.message; // Extract the message from the request body
    console.log("Received message:", message);

    // Process the message (send response and store in Supabase)
    await processMessage(message);

    res.status(200).send("Message processed");
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).send("Error processing message");
  }
};

module.exports = { webhookHandler };
