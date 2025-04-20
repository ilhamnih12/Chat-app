const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const filePath = path.join(__dirname, 'messages.json');

  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]'); // Buat file kosong jika belum ada
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read messages', details: error.message })
    };
  }
};
