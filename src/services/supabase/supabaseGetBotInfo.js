const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dbGetBotInfo = async (botId) => {
  try {
    const { data: botInfo, error } = await supabase
      .from("bots")
      .select("*") // Use '*' to select all columns
      .eq("bot_id", botId); // Replace `botId` with the actual ID you're searching for
    if (error) {
      console.error("Error");
    }
    return botInfo;
  } catch (err) {
    console.error("Unexpected error");
  }
};

module.exports = { dbGetBotInfo };
