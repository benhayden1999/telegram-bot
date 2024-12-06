const axios = require("axios");

async function newThread(apikey) {
  const url = "https://api.openai.com/v1/threads";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apikey}`,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error creating new thread:", error);
    throw error;
  }
}

exports.module = { newThread };
