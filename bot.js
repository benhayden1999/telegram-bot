// Import required modules
import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
// Load environment variables
dotenv.config();
// Initialize the bot
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on(message("text"), (ctx) => {
  console.log(msg);
});

bot.launch();

console.log("Bot is running...");
