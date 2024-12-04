require("dotenv").config();
const { Telegraf } = require("telegraf");

// Load environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;

// Initialize the bot
const bot = new Telegraf(BOT_TOKEN);

// Mirror every message received
bot.on("text", (ctx) => {
  ctx.reply(ctx.message.text);
});

// Start bot
bot
  .launch()
  .then(() => console.log("Bot is running..."))
  .catch((err) => console.error("Error launching bot:", err));

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
