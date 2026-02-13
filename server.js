const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Simple file-based "database" (JSON) ---
const dataPath = path.join(__dirname, 'contact_submissions.json');

function readSubmissions() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeSubmissions(list) {
  fs.writeFileSync(dataPath, JSON.stringify(list, null, 2), 'utf8');
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend (index.html, styles, scripts, etc.)
app.use(express.static(__dirname));

// Contact endpoint: stores submissions in JSON file
app.post('/api/contact', (req, res) => {
  const { name, email, company, role, timeline, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required fields.',
    });
  }

  const submissions = readSubmissions();

  const entry = {
    id: submissions.length + 1,
    name,
    email,
    company: company || '',
    role: role || '',
    timeline: timeline || '',
    message,
    received_at: new Date().toISOString(),
  };

  submissions.push(entry);

  try {
    writeSubmissions(submissions);
    console.log('New contact submission stored with id:', entry.id);
  } catch (err) {
    console.error('Failed to store contact submission:', err);
    return res.status(500).json({
      ok: false,
      error: 'Unable to store your message right now. Please try again later.',
    });
  }

  return res.json({
    ok: true,
    message: 'Thanks for reaching out – we’ll get back to you shortly.',
  });
});

// Fallback to index.html for any unknown GET route (optional)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Veltrynox server listening on http://localhost:${PORT}`);
  console.log(`Contact submissions are stored in JSON at ${dataPath}`);
});

