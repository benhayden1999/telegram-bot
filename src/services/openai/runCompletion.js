const axios = require("axios");

async function createThreadAndRun(
  apiKey,
  assistantId,
  messageText,
  threadId = null
) {
  console.log("look at", apiKey, assistantId, messageText, threadId);
  try {
    if (!threadId) {
      // Create a new thread if threadId is not provided
      const threadResponse = await axios.post(
        "https://api.openai.com/v1/threads",
        {},
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2",
          },
        }
      );
      threadId = threadResponse.data.id;
    }

    // Log the threadId after creation or if it was provided
    console.log("Using threadId:", threadId);

    // Add a message to the thread
    await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        role: "user",
        content: messageText,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );

    // Run the thread
    let runId;
    try {
      const runResponse = await axios.post(
        `https://api.openai.com/v1/threads/${threadId}/runs`,
        {
          assistant_id: String(assistantId), // Ensure assistant_id is a string
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2",
          },
        }
      );

      runId = runResponse.data.id;
      console.log("Run response data:", runResponse.data);
    } catch (error) {
      if (error.response) {
        console.error("Error running thread:", error.response.data);
      } else {
        console.error("Error running thread:", error.message);
      }
      throw error;
    }

    // Await the run completion
    const generatedText = await awaitRunCompletion(apiKey, threadId, runId);
    return generatedText;
  } catch (error) {
    console.error("Error in createThreadAndRun:", error);
    throw error;
  }
}

async function awaitRunCompletion(apiKey, threadId, runId) {
  while (true) {
    try {
      const statusResponse = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2",
          },
        }
      );

      const runStatus = statusResponse.data.status;

      if (runStatus === "completed") {
        // Run has completed; fetch the messages to get the assistant's reply
        const messagesResponse = await axios.get(
          `https://api.openai.com/v1/threads/${threadId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "OpenAI-Beta": "assistants=v2",
            },
          }
        );

        // Find the assistant's message
        // After fetching messages from the API
        const messages = messagesResponse.data.data;

        // Filter assistant messages
        const assistantMessages = messages.filter(
          (message) => message.role === "assistant"
        );

        // Option 1: If messages are ordered from newest to oldest, get the first one
        if (assistantMessages.length > 0) {
          const assistantMessage = assistantMessages[0];
          // Extract the text content
          const content = assistantMessage.content
            .map((part) => (part.text ? part.text.value : ""))
            .join("");

          return content.trim();
        } else {
          return "No output generated";
        }
      } else if (runStatus === "failed") {
        throw new Error("Run failed");
      }

      // Wait for a short period before polling again
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      if (error.response) {
        console.error("Error polling run status:", error.response.data);
      } else {
        console.error("Error polling run status:", error.message);
      }
      throw error;
    }
  }
}

module.exports = { createThreadAndRun };
