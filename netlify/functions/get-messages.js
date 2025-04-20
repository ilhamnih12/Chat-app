require("dotenv").config(); // Load environment variables

const fs = require("fs-extra");
const path = require("path");

const messagesPath = path.join(__dirname, "messages.json");

exports.handler = async () => {
  let messages = [];
  try {
    messages = await fs.readJson(messagesPath);
  } catch {
    messages = [];
  }

  return {
    statusCode: 200,
    body: JSON.stringify(messages),
    headers: { "Content-Type": "application/json" },
  };
};
