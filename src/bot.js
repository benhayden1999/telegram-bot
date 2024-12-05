const config = require("../config");
const { Telegraf } = require("telegraf");

const BOT_TOKEN = config.BOT_TOKEN;

// Initialize the bot
const bot = new Telegraf(BOT_TOKEN);

// Listen for text messages
bot.on("text", async (ctx) => {
  try {
    const chatId = ctx.chat.id; // ID of the chat where the message was sent
    const userMessage = ctx.message.text; // The text sent by the user

    // Prepare the invoice parameters
    const invoiceParams = {
      chat_id: ctx.chat.id,
      title: "Premium Message", // The product name
      description: `This is an invoice for your message: "${userMessage}"`, // Product description
      payload: "invoice_payload", // A custom identifier for this invoice
      provider_token: "",
      currency: "XTR", // Stars currency
      prices: [
        { label: "Total", amount: 1 }, // Price in smallest currency unit (e.g., 500 Stars)
      ],
    };
    console.log(ctx.chat.id);
    console.log(ctx.message.text);
    // Send the invoice
    await ctx.telegram.sendInvoice(
      chat_id: "6774580040", // Correctly formatted dynamic chat ID
      title: "Premium Message", // Static title
      description: "This is an invoice for your premium message.", // Static description
      payload: "yes", // Unique payload
      provider_token: "", // Empty for Stars payments
      currency: "XTR", // Stars currency
      prices: [
        { label: "Total", amount: 100 }, // Price in smallest currency units
      ],
    );

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
