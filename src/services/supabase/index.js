const dbAddInvoice = require("./supabaseAddInvoice");
const dbGetInvoice = require("./supabaseGetInvoice");
const dbGetBotInfo = require("./supabaseGetBotInfo");
// When new file added, add here

// const {} = require("./services/supabase");

module.exports = {
  ...dbAddInvoice,
  ...dbGetInvoice,
  ...dbGetBotInfo,
};
