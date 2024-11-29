// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { webhookHandler } = require("./controllers/webhookController");

const app = express();

// Use bodyParser middleware to handle incoming JSON requests
app.use(bodyParser.json());

// Set up the webhook route
app.post("/webhook", webhookHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
