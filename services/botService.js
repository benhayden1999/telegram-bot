// services/botService.js
const axios = require("axios");
const supabaseService = require("./supabaseService"); // Import the supabase service
const TELEGRAM_API_URL = require("../config/telegram"); // Get Telegram API URL from config

// Function to send a message to a Telegram user
const sendMessage = async (chatId, text) => {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
    console.log("Message sent:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Function to process the incoming message and send a response
const processMessage = async (message) => {
  const chatId = message.chat.id;
  const userMessage = message.text;

  // Prepare message data to store in Supabase
  const messageData = {
    chat_id: chatId,
    user_id: message.from.id,
    username: message.from.username,
    message_text: userMessage,
    message_type: "text",
  };

  // Respond to the user based on the message they sent
  if (userMessage === "/start") {
    await sendMessage(chatId, "Welcome to the bot!");
  } else if (userMessage === "/help") {
    await sendMessage(chatId, "Here is how you can use the bot...");
  } else {
    await sendMessage(chatId, `You said: ${userMessage}`);
  }

  // Store the message in Supabase
  await supabaseService.insertMessage(messageData);
};

module.exports = { sendMessage, processMessage };
