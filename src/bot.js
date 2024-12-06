const config = require("../config");
const { Telegraf, Context } = require("telegraf");
const { dbAddInvoice } = require("./services/supabase");
const { dbGetBotInfo } = require("./services/supabase");
const { dbGetInvoice } = require("./services/supabase");
const { dbUpdateBotPrice } = require("./services/supabase");
const { createThreadAndRun } = require("./services/openai/runCompletion");

const BOT_TOKEN = config.BOT_TOKEN;

// Initialize the bot
const bot = new Telegraf(BOT_TOKEN);

let botId;
let price;
let ownerId;

// Middleware to set botInfo
bot.use(async (ctx, next) => {
  console.log(ctx.message.from);
  if (ctx.botInfo) {
    const botInfo = await dbGetBotInfo(ctx.botInfo.id);
    console.log(botInfo);
    // Store bot information in ctx.state
    ctx.state.botId = ctx.botInfo.id;
    ctx.state.price = botInfo[0].bot_price;
    ctx.state.ownerId = botInfo[0].owner_id;
  }
  await next(); // Pass control to the next middleware/handler
});

bot.command("changeprice", async (ctx) => {
  const ownerId = ctx.state.ownerId; // Access ownerId from ctx.state
  if (ctx.from.id !== ownerId) {
    return ctx.reply("You are not authorized to perform this action.");
  } else {
    ctx.reply("Please enter the new price for your bot.", {
      reply_markup: {
        force_reply: true,
      },
    });
  }
});

bot.on("text", async (ctx) => {
  console.log("Received text message:", ctx.message.text);

  // Check if the message is a reply to the price prompt
  if (
    ctx.message.reply_to_message &&
    ctx.message.reply_to_message.text ===
      "Please enter the new price for your bot."
  ) {
    const ownerId = ctx.state.ownerId; // Access ownerId from ctx.state
    if (ctx.from.id !== ownerId) {
      return ctx.reply("You are not authorized to perform this action.");
    }

    const newPrice = parseFloat(ctx.message.text);
    if (isNaN(newPrice)) {
      return ctx.reply("Invalid number. Try again /changeprice.");
    }

    // Update the bot price in the database
    await dbUpdateBotPrice(ctx.state.botId, newPrice);
    return ctx.reply(`The new price for your bot has been set to ${newPrice}.`);
  }

  // Handle other text messages
  try {
    // Define the invoice parameters
    const invoiceParams = {
      chat_id: ctx.chat.id,
      title: "Premium Message", // The product name
      description: `Your Message: "${ctx.message.text}"`, // Product description
      payload: ctx.message.message_id, // A custom identifier for this invoice
      provider_token: "",
      currency: "XTR", // Stars currency
      prices: [
        { label: "Total", amount: ctx.state.price }, // Price in smallest currency unit (e.g., 500 Stars)
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
      ctx.state.price
    );
    console.log("Invoice added to database:", result);
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
