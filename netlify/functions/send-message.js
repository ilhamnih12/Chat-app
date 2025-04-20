require("dotenv").config(); // Load environment variables
const fs = require("fs-extra");
const path = require("path");
const Pusher = require("pusher");

const messagesPath = path.join(__dirname, "messages.json");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);

  // Read existing messages
  let messages = [];
  try {
    messages = await fs.readJson(messagesPath);
  } catch {
    messages = [];
  }

  // Add new message
  const message = {
    username: data.username,
    content: data.content,
    timestamp: Date.now(),
  };
  messages.push(message);

  // Save messages
  await fs.writeJson(messagesPath, messages);

  // Trigger Pusher
  await pusher.trigger("chat", "message", message);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
