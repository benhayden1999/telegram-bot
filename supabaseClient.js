require("dotenv").config(); // Load environment variables from the .env file

const { createClient } = require("@supabase/supabase-js");

// Get Supabase URL and anon key from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = supabase;
