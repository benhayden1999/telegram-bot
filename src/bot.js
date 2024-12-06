const config = require("../config");
const { Telegraf, Context } = require("telegraf");
const { dbAddInvoice } = require("./services/supabase");
const { dbGetBotInfo } = require("./services/supabase");

const BOT_TOKEN = config.BOT_TOKEN;

// Initialize the bot
const bot = new Telegraf(BOT_TOKEN);

// Listen for text messages
bot.on("text", async (ctx) => {
  let price;
  try {
    const botInfo = await dbGetBotInfo(ctx.botInfo.id);
    console.log(botInfo);
    price = botInfo[0].bot_price;
    console.log(price);
    // Prepare the invoice parameters

    const invoiceParams = {
      chat_id: ctx.chat.id,
      title: "Premium Message", // The product name
      description: `Your Message: "${ctx.message.text}"`, // Product description
      payload: "invoice_payload", // A custom identifier for this invoice
      provider_token: "",
      currency: "XTR", // Stars currency
      prices: [
        { label: "Total", amount: price }, // Price in smallest currency unit (e.g., 500 Stars)
      ],
    };

    // Send the invoice
    await ctx.replyWithInvoice(invoiceParams);

    console.log("Invoice sent successfully!");
  } catch (error) {
    console.error("Error sending invoice:", error);
    ctx.reply("Oops! Something went wrong while sending the invoice.");
  }
  try {
    const result = await dbAddInvoice(
      ctx.botInfo.id,
      ctx.message.message_id,
      ctx.message.text,
      ctx.chat.id,
      price
    );
  } catch (error) {
    console.error("Error adding invoice to database:", error);
  }
});

// Handle Pre-Checkout Queries (Payment Queries)
bot.on("pre_checkout_query", async (ctx) => {
  try {
    // Approve the payment
    await ctx.answerPreCheckoutQuery(true);

    console.log("Payment query approved.");
  } catch (error) {
    console.error("Error handling pre-checkout query:", error);
  }
});

// Handle Successful Payments
bot.on("successful_payment", async (ctx) => {
  try {
    await console.log(ctx);

    ctx.reply(
      `🎉 Payment successful! \n\n💵 Amount: ${
        total_amount / 100
      } ${currency} \n📦 Invoice Payload: ${invoice_payload}`
    );
  } catch (error) {
    console.error("Error handling successful payment:", error);
    ctx.reply("Oops! Something went wrong while processing the payment.");
  }
});

// Start the bot
bot.launch();
console.log("Bot is running...");
