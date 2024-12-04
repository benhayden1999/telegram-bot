const messageService = require("./messageService");
const userService = require("./userService");

module.exports = { ...messageService, ...userService };

const {
  insertMessageData,
  getMessageData,
  getUserData,
  updateUserData,
} = require("./services/supabase");
