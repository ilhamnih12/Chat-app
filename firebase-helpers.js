import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9JacaD9_pINVdYrdKsqtXwykQnJwWaBg",
  authDomain: "chat-app-ca53a.firebaseapp.com",
  projectId: "chat-app-ca53a",
  storageBucket: "chat-app-ca53a.firebasestorage.app",
  messagingSenderId: "815329800335",
  appId: "1:815329800335:web:2e55d0e3f9fe754b6b80fa",
  measurementId: "G-3VJP3Y2G3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
