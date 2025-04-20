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
  })
    .then(() => {
      messageInput.value = "";
      loadMessages(); // reload pesan setelah kirim
    })
    .catch((e) => {
      console.error("Failed to send message", e);
    });
}

function addMessage(data) {
  const p = document.createElement("p");
  p.textContent = `${data.username}: ${data.content}`;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function setupPusher() {
  Pusher.logToConsole = true; // aktifkan log untuk debug

  const pusher = new Pusher("3925ec66482126a69fde", {
    cluster: "mt1",
  });

  const channel = pusher.subscribe("chat");
  channel.bind("message", function (data) {
    addMessage(data);
    // reload pesan agar sinkron dengan backend
    loadMessages();
  });
}

async function loadMessages() {
  try {
    const res = await fetch("/.netlify/functions/get-messages");
    const messages = await res.json();
    messagesDiv.innerHTML = ""; // clear sebelum render ulang
    messages.forEach(addMessage);
  } catch (e) {
    console.error("Failed to load messages", e);
  }
}
