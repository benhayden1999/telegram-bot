require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// initialise Supabase Client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dbAddInvoice = async (
  bot_id,
  message_id,
  message_text,
  user_id,
  price
) => {
  try {
    const { data, error } = await supabase
      .from("invoice")
      .insert([
        {
          bot_id: bot_id,
          message_id: message_id,
          message_text: message_text,
          user_id: user_id,
          price: price,
        },
      ])
      .select();

    if (error) {
      console.error("failed to add transaction", error);
    }
    return data;
  } catch (err) {
    console.error("failed to add to supabase");
  }
};

module.exports = { dbAddInvoice };
