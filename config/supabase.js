// config/supabase.js
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // To load environment variables from .env file

// Get Supabase URL and Key from the environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = supabase;
