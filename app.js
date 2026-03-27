import { auth, db } from './firebase-helpers.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const messageInput = document.getElementById("message");
const messagesDiv = document.getElementById("messages");
const logoutButton = document.getElementById("logout-button");
const userInfoDiv = document.getElementById("user-info");

let currentUser = null;

// Render messages to the UI
function renderMessages(messages) {
    messagesDiv.innerHTML = ""; // Clear existing messages
    messages.forEach(message => {
        const p = document.createElement("p");
        p.textContent = `${message.username}: ${message.content}`;
        messagesDiv.appendChild(p);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Listen for real-time messages
function listenForMessages() {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    onSnapshot(q, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            messages.push(doc.data());
        });
        renderMessages(messages);
    });
}

// Send a message
window.sendMessage = async function() {
    const content = messageInput.value.trim();
    if (!content || !currentUser) return;

    try {
        await fetch("/.netlify/functions/send-message", {
            method: "POST",
            body: JSON.stringify({ username: currentUser.email, content: content }),
            headers: { "Content-Type": "application/json" },
        });
        messageInput.value = "";
    } catch (error) {
        console.error("Failed to send message:", error);
    }
};

// Check user session and initialize
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        userInfoDiv.textContent = `Anda login sebagai: ${currentUser.email}`;
        listenForMessages();
    } else {
        window.location.href = 'login.html';
    }
});

// Logout
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Error signing out:", error);
    }
});
