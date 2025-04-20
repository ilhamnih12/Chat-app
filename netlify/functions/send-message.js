require("dotenv").config(); // Load environment variables
const fs = require('fs');
const path = require('path');
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  const message = {
    id: Date.now(),
    username: body.username,
    content: body.content,
    timestamp: new Date().toISOString(),
  };

  const filePath = path.join(__dirname, "messages.json");

  try {
    let messages = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      messages = JSON.parse(data);
    }
    messages.push(message);
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

    // Ensure Pusher trigger is correct
    await pusher.trigger("chat", "message", message);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "Message sent and saved" }),
    };
  } catch (err) {
    console.error("Error:", err); // Log errors for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send/save message", details: err.message }),
    };
  }
};
