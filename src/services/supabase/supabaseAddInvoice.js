require("doeenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// initialise Supabase Client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let dbAddInvocie = (bot_id, message_id, message_text, user_id, price);
const { data, error } = await supabase
  .from("invoice")
  .insert([{ some_column: "someValue", other_column: "otherValue" }])
  .select();

module.exports = supabase;
