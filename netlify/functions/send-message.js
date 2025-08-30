const admin = require('firebase-admin');

// Initialize Firebase Admin SDK only if it hasn't been initialized yet
if (!admin.apps.length) {
  // Parse the service account JSON from the environment variable
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
    // Log the error for debugging purposes
    console.error('Error in send-message function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
