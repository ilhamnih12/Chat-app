const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, content } = JSON.parse(event.body);

    if (!username || !content) {
      return { statusCode: 400, body: 'Username and content are required.' };
    }

    const message = {
      username,
      content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const writeResult = await db.collection('messages').add(message);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: writeResult.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
