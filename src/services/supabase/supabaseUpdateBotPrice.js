const createClient = require("@supabase/supabase-js").createClient;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dbUpdateBotPrice = async (botId, newPrice) => {
  try {
    const { data, error } = await supabase
      .from("bots")
      .update({ bot_price: newPrice })
      .eq("bot_id", botId)
      .select();

    if (error) {
      console.error("Error updating bot price:", error);
    }

    return data;
  } catch (error) {
    console.error("Error in dbUpdateBotPrice:", error);
    return null;
  }
};

module.exports = { dbUpdateBotPrice };
