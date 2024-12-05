require("dotenv").config();

const config = {
  BOT_TOKEN: process.env.BOT_TOKEN, // Correct variable for BOT_TOKEN
  SUPABASE_URL: process.env.SUPABASE_URL, // Correct Supabase URL
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY, // Correct Supabase anon key
};

if (!config.BOT_TOKEN) {
  throw new Error("BOT_TOKEN is missing in the environment variables.");
}

module.exports = config;
