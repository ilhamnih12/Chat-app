import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://fuotedccepkedxhgtszr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1b3RlZGNjZXBrZWR4aGd0c3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDQ4OTYsImV4cCI6MjA3MTg4MDg5Nn0.LTQSs_1y96Ry8pCET1i0DrAatzHzBRXpa4brEblSOT0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const messageInput = document.getElementById("message");
const messagesDiv = document.getElementById("messages");
const logoutButton = document.getElementById("logout-button");
const userInfoDiv = document.getElementById("user-info");

let currentUser = null;
let messagesCache = [];

// Add a message to the UI
function renderMessages(messages) {
    // A simple optimization to avoid re-rendering if messages haven't changed
    if (JSON.stringify(messages) === JSON.stringify(messagesCache)) {
        return;
    }

    messagesCache = messages;
    messagesDiv.innerHTML = ""; // Clear existing messages
    messages.forEach(message => {
        const p = document.createElement("p");
        p.textContent = `${message.username}: ${message.content}`;
        messagesDiv.appendChild(p);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Load messages from Supabase
async function loadMessages() {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });

    if (error) {
        console.error("Error loading messages:", error);
        return;
    }
    renderMessages(data);
}

// Send a message
window.sendMessage = async function() {
    const content = messageInput.value.trim();
    if (!content) return;

    const { error } = await fetch("/.netlify/functions/send-message", {
        method: "POST",
        body: JSON.stringify({ username: currentUser.email, content: content }),
        headers: { "Content-Type": "application/json" },
    });

    if (error) {
        console.error("Failed to send message:", error);
    } else {
        messageInput.value = "";
        // Instantly load messages after sending for a smoother experience
        await loadMessages();
    }
};

// Check user session and initialize
async function checkUserAndInitialize() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        userInfoDiv.textContent = `Anda login sebagai: ${currentUser.email}`;

        // Initial load of messages
        await loadMessages();

        // Set up polling to check for new messages every 3 seconds
        setInterval(loadMessages, 3000);

    } else {
        window.location.href = 'login.html';
    }
}

// Logout
logoutButton.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
});

// Initial load
checkUserAndInitialize();
