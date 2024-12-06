const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dbGetInvoice = async (botId, user_id, messageId) => {
  try {
    // Fetch the message_text from the invoice table
    console.log(botId, user_id, messageId);
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoice")
      .select("message_text")
      .eq("bot_id", botId)
      .eq("user_id", user_id)
      .eq("message_id", messageId)
      .single(); // Expect a single matching row

    if (invoiceError) {
      console.error("Error fetching message_text:", invoiceError);
      return null; // Handle error appropriately
    }

    // Fetch the gpt_api value from the bots table
    const { data: bot, error: botError } = await supabase
      .from("bots")
      .select("gpt_api")
      .eq("bot_id", botId)
      .single(); // Expect a single matching row

    if (botError) {
      console.error("Error fetching gpt_api:", botError);
      return null; // Handle error appropriately
    }

    // Fetch the thread_id from the chat table
    const { data: chat, error: chatError } = await supabase
      .from("chat")
      .select("thread_id, assistant_id")
      .eq("bot_id", botId)
      .maybeSingle(); // Expect a single matching row or null

    if (chatError) {
      console.error("Error fetching thread_id:", chatError);
      return null; // Handle error appropriately
    }

    // Return gpt_api, message_text, and thread_id
    return {
      gpt_api: bot.gpt_api,
      message_text: invoice.message_text,
      thread_id: chat ? chat.thread_id : null, // Return null if thread_id is not found
      assistant_id: chat ? chat.assistant_id : null, // Return null if assistant_id is not found
    };
  } catch (error) {
    console.error("Error in dbGetInvoice:", error);
    return null; // Handle error appropriately
  }
};

module.exports = { dbGetInvoice };
