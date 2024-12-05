const dbAddInvocie = require("./supabaseAddInvoice");
const dbGetInvoice = require("./supabaseRetrieveInvoice");
// When new file added, add here

const {
  insertMessageData,
  getMessageData,
  getUserData,
  updateUserData,
} = require("./services/supabase");

module.exports = {
  ...dbAddInvoice,
  ...dbGetInvoice,
};
