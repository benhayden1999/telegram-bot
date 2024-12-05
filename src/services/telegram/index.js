require("dotenv").config();
const { Telegraf } = require("telegraf");

// Initialize the bot
const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new Telegraf(BOT_TOKEN);

// Listen for text messages
bot.on("text", async (ctx) => {
  try {
    const chatId = ctx.chat.id; // ID of the chat where the message was sent
    const userMessage = ctx.message.text; // The text sent by the user

    // Prepare the invoice parameters
    const invoiceParams = {
      chat_id: chatId,
      title: "Special Product", // The product name
      description: `This is an invoice for your message: "${userMessage}"`, // Product description
      payload: "invoice_payload", // A custom identifier for this invoice
      provider_token: "",
      currency: "XTR", // Stars currency
      prices: [
        { label: "Total", amount: 1 }, // Price in smallest currency unit (e.g., 500 Stars)
      ],
      start_parameter: "start",
    };

    // Send the invoice
    await ctx.telegram.sendInvoice(invoiceParams);

    console.log("Invoice sent successfully!");
  } catch (error) {
    console.error("Error sending invoice:", error);
    ctx.reply("Oops! Something went wrong while sending the invoice.");
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
bot.on("successful_payment", (ctx) => {
  try {
    const paymentDetails = ctx.message.successful_payment; // Get payment details
    const { total_amount, invoice_payload, currency } = paymentDetails;

    console.log("Payment successful:", paymentDetails);

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
