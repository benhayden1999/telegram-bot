const dbAddInvoice = require("./supabaseAddInvoice");
const dbGetInvoice = require("./supabaseGetInvoice");
const dbGetBotInfo = require("./supabaseGetBotInfo");
const dbUpdateBotPrice = require("./supabaseUpdateBotPrice");

// When new file added, add here

// const {} = require("./services/supabase");

module.exports = {
  ...dbAddInvoice,
  ...dbGetInvoice,
  ...dbGetBotInfo,
  ...dbUpdateBotPrice,
};
