// services/supabaseService.js
const supabase = require("../config/supabase"); // Import the Supabase client

// Function to insert a message into the Supabase database
const insertMessage = async (messageData) => {
  try {
    const { data, error } = await supabase
      .from("messages") // The table name in Supabase
      .insert([messageData]); // Insert the message into the table

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error inserting message into Supabase:", err);
    throw err;
  }
};

module.exports = { insertMessage };
