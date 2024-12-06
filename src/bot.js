const config = require("../config");
const { Telegraf, Context } = require("telegraf");
const { dbAddInvoice } = require("./services/supabase");
const { dbGetBotInfo } = require("./services/supabase");
const { dbGetInvoice } = require("./services/supabase");
const { createThreadAndRun } = require("./services/openai");

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
      payload: ctx.message.message_id, // A custom identifier for this invoice
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

bot.on("successful_payment", async (ctx) => {
  try {
    const paymentDetails = await dbGetInvoice(
      ctx.botInfo.id,
      ctx.from.id,
      ctx.message.successful_payment.invoice_payload
    );

    if (!paymentDetails) {
      throw new Error("Payment details not found");
    }

    const { gpt_api, message_text, thread_id, assistant_id } = paymentDetails;
    console.log("Payment successful:", paymentDetails);

    // Call createThreadAndRun with the appropriate parameters
    const response = await createThreadAndRun(
      gpt_api,
      assistant_id,
      message_text,
      thread_id
    );
    console.log("Generated response:", response);
    // You can now use the response, e.g., send it back to the user
    ctx.reply(response);
  } catch (error) {
    console.error("Error handling successful payment:", error);
    ctx.reply("Oops! Something went wrong while processing the payment.");
  }
});

// Start the bot
bot.launch();
console.log("Bot is running...");
