const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const messagesDiv = document.getElementById("messages");

let user = JSON.parse(localStorage.getItem("chatUser"));

if (user) {
  showChat();
  setupPusher();
}

function login() {
  const username = usernameInput.value.trim();
  if (!username) return;

  const id = "user_" + Math.random().toString(36).substring(2, 10);
  user = { id, username };
  localStorage.setItem("chatUser", JSON.stringify(user));
  showChat();
  setupPusher();
}

function showChat() {
  loginDiv.style.display = "none";
  chatDiv.style.display = "block";
  loadMessages();
}

function sendMessage() {
  const content = messageInput.value.trim();
  if (!content) return;

  fetch("/.netlify/functions/send-message", {
    method: "POST",
    body: JSON.stringify({ ...user, content }),
    headers: { "Content-Type": "application/json" },
  });

  messageInput.value = "";
}

function addMessage(data) {
  const p = document.createElement("p");
  p.textContent = `${data.username}: ${data.content}`;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function setupPusher() {
  Pusher.logToConsole = false;

  const pusher = new Pusher("PUSHER_KEY_FROM_ENV", {
    cluster: "PUSHER_CLUSTER_FROM_ENV",
  });

  const channel = pusher.subscribe("chat");
  channel.bind("message", addMessage);
}

async function loadMessages() {
  try {
    const res = await fetch("/.netlify/functions/get-messages");
    const messages = await res.json();
    messages.forEach(addMessage);
  } catch (e) {
    console.error("Failed to load messages", e);
  }
}
