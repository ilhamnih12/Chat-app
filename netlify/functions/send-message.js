const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

exports.handler = async (event) => {
  const data = JSON.parse(event.body);

  await pusher.trigger("chat", "message", data);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
